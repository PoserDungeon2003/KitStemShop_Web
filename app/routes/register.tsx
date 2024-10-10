import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { object, ref, string, InferType, number } from "yup";

const schema = object({
  fullName: string().required('Full name is required').trim(),
  userName: string().required('Full name is required').trim(),
  passwordHash: string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(25, "Mật khẩu không được quá 25 ký tự")
    .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ in hoa')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải có ít nhất một ký tự đặc biệt')
    .required()
    .trim(),
  confirmPassword: string()
    .oneOf([ref('passwordHash')], 'Mật khẩu xác nhận không khớp')
    .required(),
  email: string().email('Invalid email').required('Email is required').trim(),
  address: string().required('Address is required').trim(),
  phone: number().required('Phone number is required').typeError('Phone number is required').positive('Phone number is required').integer('Phone number is required'),
})

const resolver = yupResolver(schema)

type LoginForm = InferType<typeof schema>

export default function Register() {
  const { register, formState: { errors, isSubmitting }, handleSubmit, setError, watch } = useForm<LoginForm>({
    mode: 'onChange',
    resolver,
  })
  const onSubmit = (data: LoginForm) => {

  }

  return (
    <div className="contain py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Create an account</h2>
        <p className="text-gray-600 mb-6 text-sm">Register for new customer</p>

        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="text-gray-600 mb-2 block">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="fulan fulana"
              />
            </div>
            <div>
              <label htmlFor="name" className="text-gray-600 mb-2 block">Username</label>
              <input
                type="text"
                {...register('userName')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="username"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">Email address</label>
              <input
                type="email"
                {...register('email')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="youremail.@domain.com"
              />
            </div>
            <div>
              <label htmlFor="address" className="text-gray-600 mb-2 block">Address</label>
              <input
                type="text"
                {...register('address')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="145 Đường Nguyễn Cơ Thạch"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-gray-600 mb-2 block">Phone number</label>
              <input
                type="tel"
                inputMode="tel"
                {...register('phone')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="0906"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">Password</label>
              <input
                type="password"
                {...register('passwordHash')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="text-gray-600 mb-2 block">Confirm password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="aggrement"
                id="aggrement"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="aggrement" className="text-gray-600 ml-3 cursor-pointer">
                I have read and agree to the{' '}
                <a href="#" className="text-primary">terms & conditions</a>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              Create account
            </button>
          </div>
        </form>

        {/* login with */}
        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">Or signup with</div>
          <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
        </div>
        <div className="mt-4 flex gap-4">
          <Link
            to="#"
            className="w-1/2 flex flex-1 items-center justify-center gap-2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700"
          >
            <FaFacebook className="aspect-square w-5 h-5" />
            <span>Facebook</span>
          </Link>
          <Link
            to="#"
            className="w-1/2 flex flex-1 items-center justify-center gap-2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
          >
            <FaGoogle className="aspect-square w-5 h-5" />
            <span>Google</span>
          </Link>
        </div>
        {/* ./login with */}

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary">Login now</Link>
        </p>
      </div>
    </div>
  )
}