import os

def list_cs_files_and_write_to_txt(directory, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.cs'):
                    file_path = os.path.join(root, file)
                    outfile.write(f'---- {file_path} ----\n')
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())
                        outfile.write('\n\n')

if __name__ == "__main__":
    directory = "."  # Replace with the path to your directory
    output_file = "all_cs_files_contents.txt"
    list_cs_files_and_write_to_txt(directory, output_file)
    print(f"Contents of all C# files have been written to {output_file}")
