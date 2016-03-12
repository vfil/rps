Feature: Playing against Computer
  As a frequent games player,
  I’d like to play rock, paper, scissors against Computer
  So that I can spend an hour of my day having fun.

  Scenario: Rock crushes Scissors
    Given "Player" picks up "Rock"
    When "Computer" picks up "Scissors"
    Then "Player" wins

  Scenario: Paper covers "Rock"
    Given "Player" picks up "Rock"
    When "Computer" picks up "Paper"
    Then "Computer" wins

  Scenario: Scissors cut paper
    Given "Player" picks up "Scissors"
    When "Computer" picks up "Paper"
    Then "Player" wins

  Scenario Rock equality
    Given "Player" picks up "Rock"
    When "Computer" picks up "Rock"
    Then "Nobody" wins

  Scenario Paper equality
    Given "Player" picks up "Paper"
    When "Computer" picks up "Paper"
    Then "Nobody" wins

  Scenario Scissors equality
    Given "Player" picks up "Scissors"
    When "Computer" picks up "Scissors"
    Then "Nobody" wins
