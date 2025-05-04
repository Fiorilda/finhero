# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_04_104028) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "bank_accounts", force: :cascade do |t|
    t.string "name", null: false
    t.string "account_type", null: false
    t.decimal "balance", precision: 10, scale: 2, default: "0.0"
    t.string "number", null: false
    t.boolean "is_default", default: false
    t.string "owner_type", null: false
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["number"], name: "index_bank_accounts_on_number", unique: true
    t.index ["owner_type", "owner_id"], name: "index_bank_accounts_on_owner"
    t.index ["owner_type", "owner_id"], name: "index_bank_accounts_on_owner_type_and_owner_id"
  end

  create_table "children", force: :cascade do |t|
    t.string "name", null: false
    t.integer "age", null: false
    t.string "email"
    t.string "phone"
    t.string "school"
    t.string "avatar"
    t.boolean "is_active", default: true
    t.bigint "parent_id", null: false
    t.integer "xp", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_children_on_email", unique: true
    t.index ["parent_id"], name: "index_children_on_parent_id"
  end

  create_table "chores", force: :cascade do |t|
    t.string "name", null: false
    t.decimal "value", precision: 10, scale: 2, null: false
    t.string "due_day", null: false
    t.boolean "completed", default: false
    t.boolean "enabled", default: true
    t.datetime "last_completed"
    t.string "recurrence", null: false
    t.bigint "child_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_id", "name"], name: "index_chores_on_child_id_and_name", unique: true
    t.index ["child_id"], name: "index_chores_on_child_id"
  end

  create_table "finance_videos", force: :cascade do |t|
    t.string "title", null: false
    t.text "description", null: false
    t.string "thumbnail_url", null: false
    t.string "video_url", null: false
    t.string "duration", null: false
    t.integer "likes", default: 0
    t.integer "views", default: 0
    t.string "tags", default: [], array: true
    t.integer "for_age_groups", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["for_age_groups"], name: "index_finance_videos_on_for_age_groups", using: :gin
    t.index ["tags"], name: "index_finance_videos_on_tags", using: :gin
    t.index ["title"], name: "index_finance_videos_on_title"
  end

  create_table "investments", force: :cascade do |t|
    t.string "symbol", null: false
    t.string "name", null: false
    t.decimal "shares", precision: 10, scale: 4, null: false
    t.decimal "purchase_price", precision: 10, scale: 2, null: false
    t.decimal "current_price", precision: 10, scale: 2, null: false
    t.date "purchase_date", null: false
    t.bigint "child_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_id", "symbol"], name: "index_investments_on_child_id_and_symbol"
    t.index ["child_id"], name: "index_investments_on_child_id"
  end

  create_table "parents", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone"
    t.string "avatar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_parents_on_email", unique: true
  end

  create_table "quiz_questions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.text "question", null: false
    t.string "options", default: [], null: false, array: true
    t.integer "correct_option", null: false
    t.text "explanation", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id", "question"], name: "index_quiz_questions_on_quiz_id_and_question", unique: true
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "title", null: false
    t.text "description", null: false
    t.string "difficulty", null: false
    t.integer "xp_reward", null: false
    t.string "category", null: false
    t.string "completion_time", null: false
    t.string "image_url"
    t.integer "for_age_groups", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_quizzes_on_category"
    t.index ["difficulty"], name: "index_quizzes_on_difficulty"
    t.index ["for_age_groups"], name: "index_quizzes_on_for_age_groups", using: :gin
    t.index ["title"], name: "index_quizzes_on_title"
  end

  create_table "savings_goals", force: :cascade do |t|
    t.string "name", null: false
    t.decimal "target_amount", precision: 10, scale: 2, null: false
    t.decimal "current_amount", precision: 10, scale: 2, default: "0.0"
    t.date "target_date"
    t.bigint "child_id", null: false
    t.string "image_url"
    t.boolean "completed", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_id", "name"], name: "index_savings_goals_on_child_id_and_name", unique: true
    t.index ["child_id"], name: "index_savings_goals_on_child_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.string "transaction_type", null: false
    t.string "category"
    t.string "description"
    t.string "status", default: "pending"
    t.bigint "user_id", null: false
    t.bigint "from_account_id"
    t.bigint "to_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["from_account_id"], name: "index_transactions_on_from_account_id"
    t.index ["status"], name: "index_transactions_on_status"
    t.index ["to_account_id"], name: "index_transactions_on_to_account_id"
    t.index ["transaction_type"], name: "index_transactions_on_transaction_type"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "avatar"
    t.string "role", null: false
    t.string "pin", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "children", "parents"
  add_foreign_key "chores", "children"
  add_foreign_key "investments", "children"
  add_foreign_key "quiz_questions", "quizzes"
  add_foreign_key "savings_goals", "children"
  add_foreign_key "transactions", "bank_accounts", column: "from_account_id"
  add_foreign_key "transactions", "bank_accounts", column: "to_account_id"
  add_foreign_key "transactions", "users"
end
