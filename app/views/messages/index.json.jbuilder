json.array! @newMessages do |message|
  json.id message.id
  json.name message.user.name
  json.created_at message.created_at
  json.image message.image
  json.content message.content
end
