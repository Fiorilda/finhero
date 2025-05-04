FactoryBot.define do
  factory :quiz_question do
    quiz { nil }
    question { "MyText" }
    correct_option { 1 }
    explanation { "MyText" }
  end
end
