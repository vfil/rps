Feature:
  As a game player,
  I would like to play a scored game
  So I can see if I win or loose the game

  Scenario: Winning a round
    Given I have 0 wins
    And Computer has 0 wins
    When I win next round
    Then I have 1 round wins
    And Computer has 0 round wins

  Scenario: Losing a round
    Given I have 0 wins
    And Computer has 0 wins
    When I lose next round
    Then I have 0 round wins
    And Computer has 1 round wins

  Scenario: Tie round
    Given I have 0 wins
    And Computer has 0 wins
    When it is Tie
    Then I have 0 round wins
    And Computer has 0 round wins

  Scenario: Winning a game
    Given I have 2 round wins
    And Computer has 2 round wins
    When I win next round
    Then I win the game

  Scenario: Losing a game
    Given I have 2 round wins
    And Computer has 2 round wins
    When Computer wins next round
    Then Computer wins the game
