require 'test_helper'

class LeadersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get leaders_index_url
    assert_response :success
  end

end
