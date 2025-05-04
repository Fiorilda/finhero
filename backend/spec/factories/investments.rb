FactoryBot.define do
  factory :investment do
    symbol { "MyString" }
    name { "MyString" }
    shares { "9.99" }
    purchase_price { "9.99" }
    current_price { "9.99" }
    purchase_date { "2025-05-04" }
    child { nil }
  end
end
