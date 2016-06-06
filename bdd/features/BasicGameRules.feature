Feature: Basic Game Rules
  As a game player,
  I would like the game rules to be consistent with classical "rock-paper-scissors" game rules
  So I have a sensation of familiarity while playing.

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
