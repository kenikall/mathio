Rails.application.routes.draw do
  # resources :games#, only: [:index, :show]

  get 'results/show'

  get 'leaders/index'

  root 'games#mathhunt'

  get 'games/flappymath'

  get 'games/mathhunt'

end


# Rails.application.routes.draw do
#   get 'players/new' => 'players#new'

#   post 'players' => 'players#create'

#   delete 'players/logout' => 'players#destroy'

#   devise_for :users
#   resources :users, only: [:index, :show]

#   resources :games, only: [:index, :show]

#   post 'results' => 'results#create'

#   root 'games#index'

#   get 'matches/:id' => 'matches#show'
# end
