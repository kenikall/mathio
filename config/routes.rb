Rails.application.routes.draw do
  get 'results/show'

  get 'leaders/index'

  root 'games#index'

  get 'games/show'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
