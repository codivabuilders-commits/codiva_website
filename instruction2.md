Build a complete Promotions & Special Pricing System for Codiva Builders.

The goal is to allow the admin to either create reusable promo codes for marketing campaigns or create one-off discounted payment links for individual parents.

1. Promo Code Management (Admin)

Create an Admin page called Promotions.

The admin should be able to:

View all promo codes
Create new promo codes
Edit promo codes
Disable promo codes
Delete promo codes
Duplicate promo codes

Display them in a table with:

Code
Description
Discount Type
Discount Value
Usage Count
Usage Limit
Expiry Date
Status (Active / Expired / Disabled)
Date Created
2. Create Promo Code

The admin should be able to create promo codes with the following fields:

Basic Information

Promo Code

Examples

WELCOME20
EARLYBIRD
SUMMER50
FAMILY
VIP
SCHOLAR

Description

20% off Summer Camp
Discount Type

Dropdown

Percentage
Fixed Amount
Discount Value

If Percentage

20

means

20%

If Fixed Amount

10000

means

₦10,000 off
Applies To

Dropdown 

All Programs
Summer Innovation Academy
Holiday Innovation Camp
Builder Academy
Builder Plus
Private Coaching
School Partnerships
Coding Fundamentals
AI for Kids
Web Development
Graphic Design
Robotics
Minimum Purchase

Optional

Example

₦30,000
Maximum Discount

Optional

Used only for Percentage discounts.

Usage Limit

Examples

Unlimited

1

10

100
One Use Per Parent

Checkbox

If checked

A parent cannot reuse the same promo.

Expiry Date

Optional

Active

Toggle

Active

Inactive

3. Checkout Page

Add a promo code field.

Promo Code

[____________]

Apply

After clicking Apply

Validate

If valid

Show

Promo Applied

WELCOME20

-₦10,000

Then update

Subtotal

Discount

Final Total

If invalid

Show

Invalid Promo Code

If expired

Show

This promotion has expired.

If usage limit reached

Show

This promo has reached its usage limit.
4. Automatic Calculations

Display

Subtotal

Discount

Amount Payable

Update immediately after promo is applied.

5. Admin Override Pricing

Create another Admin page called

Special Pricing

This is for one-off discounts without creating promo codes.

The admin should be able to

Select Parent

or

Create New Parent

Choose

Program

Number of Children

Original Price

Override Price

Example

Original

₦150,000

Override

₦50,000

The system automatically calculates

Discount

₦100,000

Reason

Textbox

Examples

Family Discount

Scholarship

VIP

Special Approval

Staff Benefit

Referral Reward

Expiry Date

Optional

Status

Pending

Paid

Expired

Cancelled

6. Generate Secure Payment Link

When Special Pricing is saved

Generate a secure payment link.

Example

https://codivabuilders.com/pay/sP8KJ4Qw9

Requirements

The link

is unique
cannot be guessed
expires if configured
only charges the overridden amount
bypasses promo codes
cannot be reused after successful payment
7. Payment Page

When someone opens the payment link

Display

Codiva Builders

Summer Innovation Academy

Children

3

Original Price

₦150,000

Special Discount

₦100,000

Amount Due

₦50,000

Button

Pay ₦50,000
8. Payment Success

After payment

Mark

Paid

Generate receipt

Send Email

Send WhatsApp notification

Update Enrollment Status

9. Admin Dashboard

Create two dashboards.

Promotions Dashboard

Show

Active Promo Codes
Expired Promo Codes
Total Discount Given
Most Used Promo
Total Promo Redemptions
Special Pricing Dashboard

Show

Parent Name
Program
Original Price
Discount Given
Amount Paid
Payment Status
Link Expiry
Payment Date
10. Security

Promo codes must

be validated on the server
never trust frontend calculations
prevent duplicate usage
prevent manipulation of discount amounts

Special payment links must

use secure random tokens
expire correctly
become invalid after successful payment
verify payment through Paystack Webhooks before marking as Paid
11. Future Scalability

Design the system so it supports:

Percentage Discounts
Fixed Amount Discounts
Buy One Get One Promotions
Family Discounts
Referral Codes
Scholarship Codes
Seasonal Promotions
Early Bird Discounts
VIP Discounts
Coupon Stacking (optional, disabled by default)
Automatic Discounts based on number of children

Use a clean, modern UI that matches the existing Codiva Builders admin dashboard, with responsive layouts, clear validation messages, and audit logging for all discount-related actions.

