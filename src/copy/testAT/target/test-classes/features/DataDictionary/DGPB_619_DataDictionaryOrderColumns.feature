@web
Feature: [DGPB-619] Order Columns

  Scenario: Select and datastore
    Given My app is running in '${DICTIONARY_HOST}:${DICTIONARY_PORT}'
    And I browse to '/dictionary/data-dictionary'
    When '1' elements exists with 'xpath://st-dropdown-menu[@id="dropdown-datastoremenu"]//li[contains(. , "hakama")]'
