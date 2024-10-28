export default function About() {
  return (
    <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="w-full lg:w-5/12 flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">About Us</h1>
          <p className="font-normal text-base leading-6 text-gray-600">
            Chúng tôi là một nhóm đam mê công nghệ gồm Thắng, Văn, Tùng và Khoa, với mục tiêu mang lại những trải nghiệm giáo dục sáng tạo qua các sản phẩm STEM. Với tinh thần đổi mới và hợp tác, chúng tôi cùng nhau xây dựng trang web bán STEM kit để khuyến khích thế hệ trẻ học tập và khám phá. Mỗi thành viên trong nhóm đều góp phần tạo nên các sản phẩm chất lượng, dễ hiểu, và bổ ích cho người dùng.
          </p>        </div>
        <div className="w-full lg:w-8/12 ">
          <img className="w-full h-full" src="https://i.ibb.co/FhgPJt8/Rectangle-116.png" alt="A group of People" />
        </div>
      </div>

      <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
        <div className="w-full lg:w-5/12 flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">Our Story</h1>
          <p className="font-normal text-base leading-6 text-gray-600 ">
            Trang web bán STEM kit của chúng tôi ra đời nhằm cung cấp các bộ dụng cụ học tập STEM cho trẻ em và người yêu thích khám phá. Nhận thấy nhu cầu học qua thực hành ngày càng lớn, chúng tôi phát triển các sản phẩm giúp trẻ rèn luyện tư duy logic và kỹ năng giải quyết vấn đề. Mỗi combo bao gồm các lab và kit thực hành, từ lắp ráp rô-bốt đến thí nghiệm hóa học, giúp việc học trở nên thú vị và sinh động.
            <br />
            Chúng tôi cam kết mang đến sản phẩm chất lượng cao, giúp gia đình và trường học dễ dàng khơi dậy đam mê sáng tạo, đồng thời đem lại trải nghiệm giáo dục bổ ích cho thế hệ trẻ.
          </p>
        </div>
        <div className="w-full lg:w-8/12 lg:pt-8">
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
            <div className="p-4 pb-6 flex justify-center flex-col items-center">
              <img className="md:block hidden rounded-lg" src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-1/409147907_2682206891954356_1290397527639041718_n.jpg?stp=dst-jpg_s160x160&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=7RtvnxRNN_EQ7kNvgHX3yMf&_nc_zt=24&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=AQKKOihmyc9saS3xMuCfQhC&oh=00_AYDJOkHyNdofk8AkL_Zv6BoAvUEEPOWVqj-9OCiAyhZZAA&oe=67258CD8" alt="Alexa featured Img" />
              <img className="md:hidden block rounded-lg" src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-1/409147907_2682206891954356_1290397527639041718_n.jpg?stp=dst-jpg_s160x160&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=7RtvnxRNN_EQ7kNvgHX3yMf&_nc_zt=24&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=AQKKOihmyc9saS3xMuCfQhC&oh=00_AYDJOkHyNdofk8AkL_Zv6BoAvUEEPOWVqj-9OCiAyhZZAA&oe=67258CD8" alt="Alexa featured Img" />
              <p className="font-medium text-xl leading-5 text-gray-800 mt-4">Thắng</p>
            </div>
            <div className="p-4 pb-6 flex justify-center flex-col items-center">
              <img className="md:block hidden rounded-lg" src="https://avatars.githubusercontent.com/u/106126039?v=4" alt="Olivia featured Img" />
              <img className="md:hidden block rounded-lg" src="https://avatars.githubusercontent.com/u/106126039?v=4" alt="Olivia featured Img" />
              <p className="font-medium text-xl leading-5 text-gray-800 mt-4">Văn</p>
            </div>
            <div className="p-4 pb-6 flex justify-center flex-col items-center">
              <img className="md:block hidden rounded-lg" src="https://avatars.githubusercontent.com/u/117078272?v=4" alt="Liam featued Img" />
              <img className="md:hidden block rounded-lg" src="https://avatars.githubusercontent.com/u/117078272?v=4" alt="Liam featued Img" />
              <p className="font-medium text-xl leading-5 text-gray-800 mt-4">Tùng</p>
            </div>
            <div className="p-4 pb-6 flex justify-center flex-col items-center">
              <img className="md:block hidden rounded-lg" src="https://avatars.githubusercontent.com/u/116586512?v=4" alt="Elijah featured img" />
              <img className="md:hidden block rounded-lg" src="https://avatars.githubusercontent.com/u/116586512?v=4" alt="Elijah featured img" />
              <p className="font-medium text-xl leading-5 text-gray-800 mt-4">Khoa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}