FactoryBot.define do
  factory :savings_goal do
    name { "MyString" }
    target_amount { "9.99" }
    current_amount { "9.99" }
    target_date { "2025-05-04" }
    child { nil }
    image_url { "MyString" }
    completed { false }
  end
end
