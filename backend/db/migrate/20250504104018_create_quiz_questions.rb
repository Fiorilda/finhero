class CreateQuizQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_questions do |t|
      t.references :quiz, null: false, foreign_key: true
      t.text :question, null: false
      t.string :options, array: true, null: false, default: []
      t.integer :correct_option, null: false
      t.text :explanation, null: false
      t.timestamps
    end

    add_index :quiz_questions, [:quiz_id, :question], unique: true
  end
end
