import os

# Initialize the base output file name and the line limit per file
base_output_file_name = "combined_output"
line_limit = 1500
file_counter = 1

# Open the first output file for writing
output_file_path = f"{base_output_file_name}_{file_counter}.txt"
output_file = open(output_file_path, 'w', encoding='utf-8')

# Initialize line counter
current_line_count = 0

# Traverse through all the directories and files in the current working directory
for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".cs"):
            # Get the full path of the .cs file
            source_path = os.path.join(root, file)
            
            # Open and read the .cs file, then write its content to the output file
            with open(source_path, 'r', encoding='utf-8') as source_file:
                for line in source_file:
                    # Skip lines containing the word "using"
                    if "using" not in line:
                        if current_line_count >= line_limit:
                            # Close the current file and open a new one
                            output_file.close()
                            file_counter += 1
                            output_file_path = f"{base_output_file_name}_{file_counter}.txt"
                            output_file = open(output_file_path, 'w', encoding='utf-8')
                            current_line_count = 0
                        
                        # Write the line to the current output file
                        output_file.write(line)
                        current_line_count += 1

            print(f"Content from {source_path} has been added to the output file.")

# Close the last output file
output_file.close()
