FactoryBot.define do
  factory :transaction do
    amount { "9.99" }
    transaction_type { "MyString" }
    category { "MyString" }
    description { "MyString" }
    status { "MyString" }
    user { nil }
  end
end
