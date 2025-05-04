FactoryBot.define do
  factory :chore do
    name { "MyString" }
    value { "9.99" }
    due_day { "MyString" }
    completed { false }
    enabled { false }
    last_completed { "2025-05-04 12:40:14" }
    recurrence { "MyString" }
    child { nil }
  end
end
