Feature:
  As a game player,
  I would like to be able to choose a random throw when I am not sure what to throw next
  So I play lucky when I feel so.

  Scenario: Choosing a random throw with enter key
    Given I haven't any gesture selected
    When I press "enter" or "space"
    Then I throw a random gesture

  Scenario: Choosing random throw while having a gesture thrown already
    Given I have a gesture selected
    When I press "enter" or "space"
    Then I throw a random gesture
    And thrown gesture is not previous selected gesture
