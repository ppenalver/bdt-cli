@web
Feature: [DGPB-458] Data dictionary get Metadata For table objects

  @ignore @tillfixed(DGPB-657)
  Scenario: The same datastore is showed two times
    Given My app is running in '${DICTIONARY_HOST}:${DICTIONARY_PORT}'
    And I browse to '/dictionary/data-dictionary'
    When '1' elements exists with 'id:undefinedbutton'
    Then I click on the element on index '0'
    When '1' elements exists with 'id:undefineditem1'
    And '0' elements exists with 'id:undefineditem2'

  Scenario: The table is extracted correctly
    Given My app is running in '${DICTIONARY_HOST}:${DICTIONARY_PORT}'
    And I browse to '/dictionary/data-dictionary'
    When '1' elements exists with 'id:undefinedbutton'
    Then I click on the element on index '0'
    When '1' elements exists with 'id:undefineditem1'
    Then I click on the element on index '0'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[1]/div/dg-datatable-container/dg-datatable/div/div[2]/st-list/section/ul/st-list-item/li'
    Then the element on index '0' has 'Meetup' as text
    Then I click on the element on index '0'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[2]/dg-data-detail-container/div/div/dg-data-column/div/div[2]/div/dg-data-field[1]/div/div/st-input/div/div/input'
    Then the element on index '0' has 'value' as 'Meetup'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[2]/dg-data-detail-container/div/div/div/dg-data-column/div/div[2]/div/div[1]/dg-data-field[1]/div/div/st-input/div/div/input'
    Then the element on index '0' has 'value' as 'name'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[2]/dg-data-detail-container/div/div/div/dg-data-column/div/div[2]/div/div[2]/dg-data-field[1]/div/div/st-input/div/div/input'
    Then the element on index '0' has 'value' as 'going'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[2]/dg-data-detail-container/div/div/div/dg-data-column/div/div[2]/div/div[3]/dg-data-field[1]/div/div/st-input/div/div/input'
    Then the element on index '0' has 'value' as 'organizer'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[2]/dg-data-detail-container/div/div/div/dg-data-column/div/div[2]/div/div[4]/dg-data-field[1]/div/div/st-input/div/div/input'
    Then the element on index '0' has 'value' as 'meetup_date'

  @ignore @tillfixed(DGPB-579)
  Scenario: The elements in the column is correct 5 instead 4. It is, the hdfs should extract the filed with "/" character
    Given My app is running in '${DICTIONARY_HOST}:${DICTIONARY_PORT}'
    And I browse to '/dictionary/data-dictionary'
    When '1' elements exists with 'id:undefinedbutton'
    Then I click on the element on index '0'
    When '1' elements exists with 'id:undefineditem1'
    Then I click on the element on index '0'
    When '1' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[1]/div/dg-datatable-container/dg-datatable/div/div[2]/st-list/section/ul/st-list-item/li'
    Then I click on the element on index '0'
    When '5' elements exists with 'xpath:/html/body/app-root/app-layout/div/div/div/dg-data-dictionary/section/div/div[2]/dg-data-detail-container/div/div/div/dg-data-column/div/div[2]/div/div/dg-data-field[1]//input'
