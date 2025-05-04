class CreateQuizzes < ActiveRecord::Migration[8.0]
  def change
    create_table :quizzes do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :difficulty, null: false
      t.integer :xp_reward, null: false
      t.string :category, null: false
      t.string :completion_time, null: false
      t.string :image_url
      t.integer :for_age_groups, array: true, default: []
      t.timestamps
    end

    add_index :quizzes, :title
    add_index :quizzes, :difficulty
    add_index :quizzes, :category
    add_index :quizzes, :for_age_groups, using: 'gin'
  end
end
