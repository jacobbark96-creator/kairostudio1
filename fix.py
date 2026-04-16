import re

with open('src/page-components/HomePage.tsx', 'r') as f:
    content = f.read()

# Find start of mobile modal
start_idx = content.find("              {/* MOBILE MODAL - Smooth Lightbox Transition */}")
if start_idx == -1:
    print("Start not found")
    exit(1)

# Find end of mobile modal
end_marker = "                      )}\n                    </div>\n                  </div>\n                </div>\n              </div>\n"
end_idx = content.find(end_marker, start_idx)

if end_idx == -1:
    print("End not found")
    exit(1)

end_idx += len(end_marker)

modal_chunk = content[start_idx:end_idx]

# Save for verification
with open('extracted_modal.txt', 'w') as f:
    f.write(modal_chunk)

print(f"Extracted {len(modal_chunk)} chars")

# Remove from content
content = content[:start_idx] + content[end_idx:]

# Modify chunk
modal_chunk = modal_chunk.replace("duration-500", "duration-200")
modal_chunk = modal_chunk.replace("duration-700", "duration-200")
modal_chunk = modal_chunk.replace("delay-100", "")
modal_chunk = modal_chunk.replace("z-[100]", "z-[9999]")
modal_chunk = modal_chunk.replace("z-[110]", "z-[10000]")

# Append before </main> or </>
insert_idx = content.rfind("    </>\n  );\n}")
content = content[:insert_idx] + "\n" + modal_chunk + content[insert_idx:]

with open('src/page-components/HomePage.tsx', 'w') as f:
    f.write(content)

print("Done")
