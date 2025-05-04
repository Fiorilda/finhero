class CreateFinanceVideos < ActiveRecord::Migration[8.0]
  def change
    create_table :finance_videos do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :thumbnail_url, null: false
      t.string :video_url, null: false
      t.string :duration, null: false
      t.integer :likes, default: 0
      t.integer :views, default: 0
      t.string :tags, array: true, default: []
      t.integer :for_age_groups, array: true, default: []
      t.timestamps
    end

    add_index :finance_videos, :title
    add_index :finance_videos, :tags, using: 'gin'
    add_index :finance_videos, :for_age_groups, using: 'gin'
  end
end
