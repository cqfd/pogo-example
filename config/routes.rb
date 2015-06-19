Rails.application.routes.draw do
  root to: "welcome#index"
  get "numbers", to: "welcome#numbers"
end
