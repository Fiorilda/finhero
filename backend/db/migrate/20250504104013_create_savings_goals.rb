class CreateSavingsGoals < ActiveRecord::Migration[8.0]
  def change
    create_table :savings_goals do |t|
      t.string :name, null: false
      t.decimal :target_amount, precision: 10, scale: 2, null: false
      t.decimal :current_amount, precision: 10, scale: 2, default: 0.0
      t.date :target_date
      t.references :child, null: false, foreign_key: true
      t.string :image_url
      t.boolean :completed, default: false
      t.timestamps
    end

    add_index :savings_goals, [:child_id, :name], unique: true
  end
end
