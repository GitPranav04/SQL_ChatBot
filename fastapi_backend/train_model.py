import torch
from datasets import Dataset
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, Seq2SeqTrainer, Seq2SeqTrainingArguments, TextDataset, DataCollatorForSeq2Seq
import json

# Load model and tokenizer
MODEL_NAME = "Salesforce/codet5-base"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

def load_dataset(jsonl_path):
    data = []
    with open(jsonl_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue  # skip blank lines
            item = json.loads(line)
            # Use question as input, sql as target
            data.append({
                "input_text": item["question"],
                "target_text": item["sql"]
            })
    print(f"Loaded {len(data)} examples from {jsonl_path}")
    if data:
        print("Sample example:", data[0])
    return Dataset.from_list(data)

DATASET_PATH = "text2sql_dataset.jsonl"
OUTPUT_DIR = "./finetuned-t5-text2sql"

# Preprocessing function for the dataset
def preprocess_function(examples, tokenizer, max_input_length=256, max_target_length=256):
    model_inputs = tokenizer(
        examples["input_text"], max_length=max_input_length, truncation=True, padding="max_length"
    )
    labels = tokenizer(
        examples["target_text"], max_length=max_target_length, truncation=True, padding="max_length"
    )
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# TODO: Implement dataset loading and fine-tuning logic here
# Example: Load your .jsonl file, preprocess, and train
# See Hugging Face docs for full fine-tuning pipeline

if __name__ == "__main__":
    # Load and preprocess dataset
    dataset = load_dataset(DATASET_PATH)
    tokenized_dataset = dataset.map(lambda x: preprocess_function(x, tokenizer), batched=True)

    data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)

    training_args = Seq2SeqTrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        num_train_epochs=30,  # Increased epochs for better accuracy
        save_steps=100,
        save_total_limit=2,
        logging_steps=10,
        learning_rate=1e-5,  # Lower learning rate for finer tuning
        warmup_steps=500,
        weight_decay=0.01,
        fp16=True if torch.cuda.is_available() else False,
        report_to=[],
        predict_with_generate=True  # Evaluate with generation
    )

    # Split dataset into train and eval sets
    train_size = int(0.9 * len(tokenized_dataset))
    eval_size = len(tokenized_dataset) - train_size
    train_dataset = tokenized_dataset.select(range(train_size))
    eval_dataset = tokenized_dataset.select(range(train_size, train_size + eval_size))

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,  # Added eval_dataset for evaluation
        data_collator=data_collator,
        tokenizer=tokenizer,
    )
    trainer.train()
    print(f"Saving model to {OUTPUT_DIR} ...")
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print("Training complete!")
