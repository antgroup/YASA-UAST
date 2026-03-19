import string


def replace_keyword(text: str, replacement_dict: dict) -> str:
    """
    This function implements a simple keyword replacement.
    Given the dictionary of keywords and their replacements, it replaces the keywords in the text.
    """
    # break the text into words
    words = text.split()

    # replace the keywords
    for i in range(len(words)):
        word_without_punctuation = words[i].strip(string.punctuation)

        if word_without_punctuation in replacement_dict:
            # Replace the original word, preserving any punctuation

            # if the replacement_dict has the word, replace it
            replacement = replacement_dict.get(word_without_punctuation, "")

            if replacement is not None and replacement != "":
                replacement = f"{word_without_punctuation} ( also called {replacement} )"  # add the replacement word

                # replace in the original word to preserve the punctuation
                words[i] = words[i].replace(word_without_punctuation, replacement)

    # join the words
    text = ' '.join(words)
    return text


def detect_synonym(text: str, synonyms: list[list[str]]) -> list:
    """
    This function implements a simple synonym detection.
    Given a list of synonym lists, which filters the synonym list with synonyms appeared in the text.
    """
    new_list = []
    for synonym_list in synonyms:
        for synonym in synonym_list:
            if synonym.lower() not in text.lower():
                continue
            new_list.append([synonym for synonym in synonym_list])
            break

    return new_list


def replace_synonym(text: str, standards_and_synonyms: tuple[list[str], list[list[str]]]) -> str:
    """
    This function implements a simple synonym replacement.
    Given a list of standard terms and their synonym lists, which filters the synonym list with synonyms appeared in the text.
    """
    new_text = text.lower()
    standards, synonyms = standards_and_synonyms[0], standards_and_synonyms[1]
    for standard, synonym_list in zip(standards, synonyms):
        for synonym in synonym_list:
            if synonym.lower() not in new_text:
                continue
            if standard:
                new_text = new_text.replace(synonym.lower(), standard)
            else:
                new_text = new_text.replace(synonym.lower(), synonym_list[0])
            break

    return new_text


if __name__ == "__main__":
    from src.db_pool import pool
    new_text = replace_synonym('正扫和反扫分别是什么意思', pool.load_synonyms())
    print(new_text)
