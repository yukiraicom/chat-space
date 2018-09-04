#DB設計

## messages table

|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false, foreign_key: true|
|text|string|
|image|string|
|group_id|integer|null: false,  foreign_key: true|

### Association
- belongs_to :user
- belongs_to :group




## users table

|Column|Type|Options|
|------|----|-------|
|name|string|null: false, add_index: true|
|email|string|null: false|

### Association

- has_many :groups, through: :members
- has_many :messages





## groups table

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|

### Association

- has_many :users, through: :members
- has_many :messages






## members table

|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false, add_index: true|
|group_id|integer|null: false|

### Association

- belongs_to :group
- belongs_to :user
