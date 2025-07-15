In this project (Frontend - AngularJS):

- I used **AngularJS** to integrate with backend APIs via controllers and services.
- Followed the **MVC structure**, with services handling business logic.
- Created a dedicated **environment.js** file for flexible and configurable base API URLs.
- Used **angular-ui-bootstrap** to implement autocomplete functionality.
- Implemented **custom validation rules** on inputs (e.g., debit/credit rules, required fields).
- Added **localStorage support** to persist user input and prevent data loss on page refresh (discarded once saved to the database).
- Handled **real-time calculations** for total debit and credit values.
- Enforced validation to ensure:
  - Only one value (either debit or credit) is entered per row.
  - The total debit equals the total credit before submission.
- Used a **Bootstrap modal dialog** to confirm deletion of a row if it contains data.
- Submitted data is validated again on the backend and handled with proper exception handling and business rules.
