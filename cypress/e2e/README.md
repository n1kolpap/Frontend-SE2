#### happy-path-login.cy.js

1. Login
The login credentials in .json are:
```json
{
 "username": "john_doe",
 "password": "password123"
}
```

2. Logout

#### happy-path-full.cy.js

1. Login
The login credentials in .json are:
```json
{
 "username": "john_doe",
 "password": "password123"
}
```

2. Create a trip plan with the following specs:
- Destination: Ekei
- Origin: Edw
- Start date: 1/8/2030
- End date: 8/8/2030
- Budget: 384 euros
- Purpose: Vacation
- Interests: Nightlife Nature History
- Notes: This gonna be so fun:)

3. Click to view the daily plan

4. Click on Day 1:
- Add a day note:
	- Text: "This is where the fun begins"
	- Save note
- Add activity
	- Click to add activity
	- Add the following in the fields:
	Activity name: Super fun
	Time: 01:23
	Location: There
	Notes: Letsgo
	- Save activity
- Mark the activity as done
- Delete the activity

5. Go on overview
- Click edit trip
- Rename trip origin to "Nowhere"
- Save edit
- Click delete trip

6. Log out

#### unhappy-path-failedDates.cy.js

1. Login
The login credentials in .json are:
```json
{
 "username": "john_doe",
 "password": "password123"
}
```

2. Create a trip plan with the following specs:
- Destination: Ekei
- Origin: Edw
- Start date: 1/8/2030
- End date: 8/7/2030
- Budget: 384 euros
- Purpose: Vacation
- Interests: Nightlife Nature History
- Notes: This gonna be so fun:)

3. Check if the error appears
- `End date must be after start date.`

4. Log out

#### unhappy-path-failedLogin.cy.js

1. Login (without a username)
The login credentials in .json are:
```json
{
 "username": "",
 "password": "password123"
}
```

2. Check if the error appears
- `Username must be at least 3 characters.`

3. Login (without password)
The login credentials in .json are:
```json
{
 "username": "john_doe",
 "password": ""
}
```

4. Check if the error appears
- `Password must be at least 6 characters.`

5. Login (with incorrect password)
The login credentials in .json are:
```json
{
 "username": "john_doe",
 "password": "asdfghjkl1234567890qwertyuiopzxcvbnm"
}
```

6. Check if the error appears
- `Invalid username or password`

#### unhappy-path-failedSignup.cy.js

1. Signup (without credentials)
The login credentials in .json are:
```json
{
 "username": "",
 "password": ""
}
```

2. Check if 2 errors appear
- One is `Username must be at least 3 characters.`
- Another is `Password must be at least 6 characters.`

3. Signup (with invalid email)
The login credentials in .json are:
```json
{
 "username": "asdfghjkl1234567890qwertyuiopzxcvbnm",
 "email": "1",
 "password": "asdfghjkl1234567890qwertyuiopzxcvbnm"
}
```

4. Check if error appears
- `Please enter an email address`

5. Signup (with already existing name)
The login credentials in .json are:
```json
{
 "username": "jane_smith",
 "password": "123456"
}
```

6. Check if error appears
- `Validation failed`
