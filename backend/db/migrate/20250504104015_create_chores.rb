class CreateChores < ActiveRecord::Migration[8.0]
  def change
    create_table :chores do |t|
      t.string :name, null: false
      t.decimal :value, precision: 10, scale: 2, null: false
      t.string :due_day, null: false
      t.boolean :completed, default: false
      t.boolean :enabled, default: true
      t.datetime :last_completed
      t.string :recurrence, null: false
      t.references :child, null: false, foreign_key: true
      t.timestamps
    end

    add_index :chores, [:child_id, :name], unique: true
  end
end
