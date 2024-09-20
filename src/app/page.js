import UserLoginForm from './__components/UserLoginForm'
import UserRegistrationForm from './__components/UserRegistrationForm'

export default function page() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      {/* <UserLoginForm /> */}
      <UserRegistrationForm />
    </div>
  )
}
