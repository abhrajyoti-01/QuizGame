"""An interactive, topic-based multiple-choice quiz for Python 3.8+."""

import random
from dataclasses import dataclass
from typing import List, Sequence, Tuple

from question_bank import QUESTION_BANK


@dataclass(frozen=True)
class Question:
    text: str
    options: Tuple[str, str, str, str]
    correct_index: int
    category: str = "General Knowledge"


def load_questions() -> List[Question]:
    """Load every question from the topic-organized dataset."""
    return [
        Question(text, options, correct_index, category)
        for category, entries in QUESTION_BANK.items()
        for text, options, correct_index in entries
    ]


def select_questions(questions: Sequence[Question], category: str, count: int) -> List[Question]:
    """Draw a random set without repeating a question during this game."""
    pool = [question for question in questions if category == "Mixed" or question.category == category]
    if not 1 <= count <= len(pool):
        raise ValueError("Question count must be between 1 and {}.".format(len(pool)))
    return random.sample(pool, count)


def choose_category(questions: Sequence[Question]) -> str:
    """Let the player choose a topic or a mix of all topics."""
    categories = list(dict.fromkeys(question.category for question in questions))
    print("\nChoose a quiz topic:")
    print("  0. Mixed (all topics)")
    for index, category in enumerate(categories, start=1):
        available = sum(question.category == category for question in questions)
        print("  {}. {} ({} questions)".format(index, category, available))
    while True:
        choice = input("Topic number (0-{}): ".format(len(categories))).strip()
        if choice.isascii() and choice.isdecimal() and int(choice) <= len(categories):
            return "Mixed" if int(choice) == 0 else categories[int(choice) - 1]
        print("Please enter a topic number from 0 to {}.".format(len(categories)))


def choose_question_count(maximum: int) -> int:
    """Ask for a valid number of questions from the chosen topic."""
    if maximum < 1:
        raise ValueError("No questions are available.")
    while True:
        choice = input("How many questions would you like (1-{})? ".format(maximum)).strip()
        if choice.isascii() and choice.isdecimal() and 1 <= int(choice) <= maximum:
            return int(choice)
        print("Please enter a whole number from 1 to {}.".format(maximum))


def display_question(question: Question, number: int, total: int) -> None:
    """Show one question and its four numbered and lettered choices."""
    print("\n" + "-" * 48)
    print("Question {} of {}: {}".format(number, total, question.text))
    for index, option in enumerate(question.options):
        print("  {} ({}). {}".format(index + 1, chr(ord("A") + index), option))


def validate_input(response: str) -> int:
    """Convert a letter or number choice to a zero-based option index."""
    choice = response.strip().upper()
    if choice in ("A", "B", "C", "D"):
        return ord(choice) - ord("A")
    if choice in ("1", "2", "3", "4"):
        return int(choice) - 1
    raise ValueError("Please enter A, B, C, D or 1, 2, 3, 4.")


def get_answer() -> int:
    """Keep asking until the player enters a valid choice."""
    while True:
        try:
            return validate_input(input("Your answer (A-D or 1-4): "))
        except ValueError as error:
            print(error)


def calculate_score(responses: Sequence[int], questions: Sequence[Question]) -> int:
    """Count correct answers from the responses given so far."""
    if len(responses) > len(questions):
        raise ValueError("There cannot be more responses than questions.")
    return sum(
        response == question.correct_index
        for response, question in zip(responses, questions)
    )


def generate_final_result(score: int, total: int) -> str:
    """Format the score, percentage and performance message."""
    if total <= 0 or not 0 <= score <= total:
        raise ValueError("Score must be between zero and a positive total.")
    percentage = score / total * 100
    if percentage >= 90:
        message = "Excellent work!"
    elif percentage >= 70:
        message = "Good job!"
    else:
        message = "Keep practicing!"
    return "\nQuiz complete!\nScore: {} / {}\nPercentage: {:.1f}%\n{}".format(
        score, total, percentage, message
    )


def run_quiz() -> None:
    """Play a randomized quiz and report progress after each answer."""
    bank = load_questions()
    if not bank:
        print("No questions are available yet.")
        return

    print("Welcome to the Quiz Game!")
    print("Answer each question with A, B, C, D or 1, 2, 3, 4.")
    print("Each correct answer earns 1 point. Invalid entries can be retried.")
    category = choose_category(bank)
    available = sum(category == "Mixed" or question.category == category for question in bank)
    count = choose_question_count(available)
    questions = select_questions(bank, category, count)
    print("\n{} quiz: {} questions. Let's begin!".format(category, count))

    responses: List[int] = []
    for number, question in enumerate(questions, start=1):
        display_question(question, number, len(questions))
        response = get_answer()
        responses.append(response)
        score = calculate_score(responses, questions)
        if response == question.correct_index:
            print("Correct!")
        else:
            print("Incorrect, the right answer was: {}.".format(
                question.options[question.correct_index]
            ))
        print("Current score: {} / {}".format(score, number))

    print(generate_final_result(calculate_score(responses, questions), len(questions)))


if __name__ == "__main__":
    try:
        run_quiz()
    except (EOFError, KeyboardInterrupt):
        print("\nQuiz ended before completion.")
