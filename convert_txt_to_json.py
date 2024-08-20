import json

# Read the .txt file
with open('dic.txt', 'r') as txt_file:
    words = txt_file.readlines()

# Process the words
words = [word.strip() for word in words if word.strip()]

# Write to a .json file
with open('dic.json', 'w') as json_file:
    json.dump(words, json_file, indent=2)

print("Successfully converted .txt to .json")
