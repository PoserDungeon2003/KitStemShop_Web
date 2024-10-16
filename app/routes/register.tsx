import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "@remix-run/react";
import { Select } from "antd";
import _ from "lodash";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { object, ref, string, InferType, number } from "yup";
import { registerAccount, useGetDistricts, useGetProvinces, useGetWards } from "~/data";

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
  province: string().required('Province is required').trim(),
  district: string().required('District is required').trim(),
  ward: string().required('Ward is required').trim(),
})

const resolver = yupResolver(schema)

type RegisterForm = InferType<typeof schema>

export default function Register() {
  const { register, formState: { errors, isSubmitting }, handleSubmit, setError, watch, setValue } = useForm<RegisterForm>({
    mode: 'onChange',
    resolver,
  })
  const navigate = useNavigate()
  const provinces = useGetProvinces();
  const districts = useGetDistricts();
  const districtId = watch('district');
  const wards = useGetWards(Number(districtId));
  const provinceId = watch('province');

  const mapProvinces = useMemo(() => {
    return _.mapKeys(provinces.data?.data, it => it.ProvinceID)
  }, [provinces.data?.data]);

  const mapDistricts = useMemo(() => {
    return _.mapKeys(districts.data?.data, it => it.DistrictID)
  }, [districts.data?.data]);

  const mapWards = useMemo(() => {
    return _.mapKeys(wards.data?.data, it => it.WardCode)
  }, [districts.data?.data, wards.data?.data]);

  const filterDistrictsByProviceId = useMemo(() => {
    return _(districts.data?.data)
      .filter(it => it.ProvinceID === Number(provinceId))
      .value()
  }, [watch('province')])

  const onSubmit = async (data: RegisterForm) => {
    console.log(data)
    try {
      let response = await registerAccount({
        ...data,
        phone: data.phone.toString(),
        address: `${data.address}, ${mapWards[data.ward]?.WardName}, ${mapDistricts[data.district]?.DistrictName}, ${mapProvinces[data.province]?.ProvinceName}`
      })
      if (response.status == 1) {
        navigate('/login')
      } else {
        setError('root', {
          message: response.message
        })
      }
    } catch (error: any) {
      setError('root', {
        message: error?.message
      })
    }
  }

  return (
    <div className="contain py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Create an account</h2>
        <p className="text-gray-600 mb-6 text-sm">Register for new customer</p>

        <form method="post" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="fullname" className="text-gray-600 mb-2 block">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="fulan fulana"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="username" className="text-gray-600 mb-2 block">Username</label>
              <input
                type="text"
                {...register('userName')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="username"
              />
              {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">Email address</label>
              <input
                type="email"
                {...register('email')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="youremail.@domain.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="address" className="text-gray-600 mb-2 block">Address</label>
              <input
                type="text"
                {...register('address')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Số 123, Đường Nguyễn Huệ"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              <div className="mt-2 flex gap-2">
                {/* <select {...register('province')} id="">
                  {_.map(provinces.data?.data, (province, index) => (
                    <option key={index} value={province.ProvinceID}>{province.ProvinceName}</option>
                  ))}
                </select> */}
                <Select
                  onChange={(value) => {
                    setValue('province', value)
                  }}
                  loading={provinces.isLoading}
                  className="w-1/3"
                  placeholder="Province/City"
                  options={_.map(provinces.data?.data, (province) => {
                    return {
                      label: province.ProvinceName,
                      value: province.ProvinceID,
                    }
                  })}
                >
                </Select>
                <Select
                  onChange={(value) => {
                    setValue('district', value)
                  }}
                  loading={districts.isLoading}
                  disabled={!watch('province')}
                  className="w-1/3"
                  placeholder="Districts"
                  options={_.map(filterDistrictsByProviceId, (district) => {
                    return {
                      label: district.DistrictName,
                      value: district.DistrictID,
                    }
                  })}
                >
                </Select>
                <Select
                  onChange={(value) => {
                    setValue('ward', value)
                  }}
                  disabled={!watch('district')}
                  loading={wards.isLoading}
                  className="w-1/3"
                  placeholder="Wards"
                  options={_.map(wards.data?.data, (ward) => {
                    return {
                      label: ward.WardName,
                      value: ward.WardCode,
                    }
                  })}
                >
                </Select>
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="text-gray-600 mb-2 block">Phone number</label>
              <input
                type="tel"
                inputMode="tel"
                {...register('phone')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="0123456789"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">Password</label>
              <input
                type="password"
                {...register('passwordHash')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
              />
              {errors.passwordHash && <p className="text-red-500 text-sm mt-1">{errors.passwordHash.message}</p>}
            </div>
            <div>
              <label htmlFor="confirm" className="text-gray-600 mb-2 block">Confirm password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                required
                name="aggrement"
                id="aggrement"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="aggrement" className="text-gray-600 ml-3 cursor-pointer">
                I have read and agree to the{' '}
                <a href="#" className="text-primary">terms & conditions</a>
              </label>
            </div>
            {errors.root && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}
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