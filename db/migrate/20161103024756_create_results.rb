class CreateResults < ActiveRecord::Migration[5.0]
  def change
    create_table :results do |t|
      t.leader :reference

      t.timestamps
    end
  end
end
