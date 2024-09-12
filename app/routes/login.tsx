import { yupResolver } from "@hookform/resolvers/yup";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useLocation, useNavigate } from "@remix-run/react";
import { FormEvent, useEffect } from "react";
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io5";
import { AuthorizationError } from "remix-auth";
import { useRemixForm } from "remix-hook-form";
import { InferType, object, string } from "yup";
import { authenticator } from "~/services/auth.server";

let loginSchema = object({
  username: string().trim().required("Username is a required field"),
  passwordHash: string().trim().required("Password is a required field"),
  loginType: string().trim().required(),
})

export type LoginFormData = InferType<typeof loginSchema>

const resolver = yupResolver(loginSchema)

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/login?success',
      throwOnError: true,
    })
  } catch (error: any) {
    console.log('error', error.cause?.cause?.name);
    let cause = (error.cause?.cause) as any
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return error;
    }
    return error;
  }
}

export default function Login() {
  const { handleSubmit, formState: { errors }, register, setValue, setError } = useRemixForm<LoginFormData>({
    mode: 'onSubmit',
    resolver,
  })
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.search == '?success') {
      navigate('/')
    }
  }, [location.search])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e)
  }

  return (
    <div className="contain py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
        <p className="text-gray-600 mb-6 text-sm">Welcome back customer</p>
        <Form onSubmit={submit} reloadDocument method="post" autoComplete="off">
          <input type="text" hidden value={'user-pass'} {...register('loginType')} />
          <div className="space-y-2">
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">Email address</label>
              <input
                type="text"
                id="email"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Email"
                {...register('username')}
              />
            </div>
            {errors.username && <strong className="text-xs text-red-500">{errors.username?.message}</strong>}
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">Password</label>
              <input
                type="password"
                id="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
                {...register('passwordHash')}
              />
            </div>
            {errors.passwordHash && <strong className="text-xs text-red-500">{errors.passwordHash?.message}</strong>}
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">Remember me</label>
            </div>
            <Link to="#" className="text-primary">Forgot password</Link>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              Login
            </button>
          </div>
        </Form>

        {/* Login with */}
        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">Or login with</div>
          <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
        </div>
        <div className="mt-4 flex gap-4">
          <Link
            to="#"
            className="w-1/2 flex flex-1 items-center justify-center gap-2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700"
          >
            <IoLogoFacebook className="aspect-square w-5 h-5" />
            <span>Facebook</span>
          </Link>
          <Link
            to="#"
            className="w-1/2 flex flex-1 items-center justify-center gap-2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
          >
            <IoLogoGoogle className="aspect-square w-5 h-5" />
            <span>Google</span>
          </Link>
        </div>
        {/* ./Login with */}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary">Register now</Link>
        </p>
      </div>
    </div>
  )
}