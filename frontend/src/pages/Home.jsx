// import React, { useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const teachers = [
//   {
//     name: "Michelle Andrade",
//     subjects: "ENGLISH, SPANISH",
//     description:
//       "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
//     color: "bg-yellow-500",
//   },
//   {
//     name: "John Stamos",
//     subjects: "ENGLISH, FRENCH, SWEDISH",
//     description:
//       "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
//     color: "bg-teal-500",
//   },
//   {
//     name: "Kelly Masterson",
//     subjects: "FRENCH, ENGLISH, SWEDISH",
//     description:
//       "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
//     color: "bg-green-500",
//   },
//   {
//     name: "Michael Wong",
//     subjects: "ENGLISH, KOREAN, RUSSIAN",
//     description:
//       "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
//     color: "bg-blue-500",
//   },
// ];

// const Home = () => {
//   useEffect(() => {
//     AOS.init({ duration: 1000 }); // Initialize AOS animations
//   }, []);

//   return (
//     <div className="home1 w-[100vw] mt-40 absolute left-0 right-0 h-full">
//       <div className="">
//         {/* Hero Section */}
//         <div
//           className="bg-gradient-to-r from-gray-800 to-teal-500 text-center py-20 px-4"
//           data-aos="fade-up"
//         >
//           <h1 className="text-white text-5xl font-bold mb-6">
//             Learn With Us.
//             <br />
//             Improve With Us.
//           </h1>
//           <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full mb-12 inline-flex items-center">
//             READ MORE
//             <i className="fas fa-rocket ml-2"></i>
//           </button>
//           <div
//             className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6"
//             data-aos="fade-up"
//           >
//             <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full md:w-64">
//               <h2 className="text-xl font-bold mb-2">EXPERIENCED FACULTY</h2>
//               <a className="text-yellow-500" href="#">
//                 Learn More &gt;
//               </a>
//             </div>
//             <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full md:w-64">
//               <h2 className="text-xl font-bold mb-2">800 PLUS STUDENTS</h2>
//               <a className="text-yellow-500" href="#">
//                 Learn More &gt;
//               </a>
//             </div>
//             <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full md:w-64">
//               <h2 className="text-xl font-bold mb-2">INNOVATIVE KNOWLEDGE</h2>
//               <a className="text-yellow-500" href="#">
//                 Learn More &gt;
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* What We Offer Section */}
//         <div className="p-2">
//           <div className="container mx-auto px-4">
//             <header className="py-6" data-aos="fade-down">
//               <h1 className="text-5xl font-bold text-center">What We Offer</h1>
//               <p className="text-xl font-semibold mt-6 text-center w-[80vw]">
//                 At Vidya Nidhi Schools, we are committed to nurturing the
//                 holistic development of our students through a balanced blend of
//                 academics, co-curricular activities, and value-based education.
//               </p>
//             </header>

//             <main>
//               <section className="my-10 flex flex-col gap-11">
//                 <div
//                   className="sec1 block md:flex justify-around items-center"
//                   data-aos="fade-right"
//                 >
//                   <div>
//                     <h2 className="text-center text-4xl font-bold mb-6 md:text-left">
//                       Personalized Attention
//                     </h2>
//                     <p className="w-[320px] text-lg md:w-[500px] md:text-xl font-semibold">
//                       Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                       Iusto aspernatur provident porro ex optio temporibus
//                       blanditiis dolorem.
//                     </p>
//                   </div>
//                   <img
//                     src=""
//                     width="400px"
//                     height="300px"
//                     className="bg-black rounded-[20px]"
//                     alt=""
//                     data-aos="zoom-in"
//                   />
//                 </div>
//                 <div
//                   className="sec1 block md:flex justify-around items-center"
//                   data-aos="fade-left"
//                 >
//                   <img
//                     src=""
//                     width="400px"
//                     height="300px"
//                     className="bg-black rounded-[20px]"
//                     alt=""
//                     data-aos="zoom-in"
//                   />
//                   <div>
//                     <h2 className="text-center text-4xl font-bold mb-6 md:text-left">
//                       Value-Based Education
//                     </h2>
//                     <p className="w-[320px] text-lg md:w-[500px] md:text-xl font-semibold">
//                       Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                       Iusto aspernatur provident porro ex optio temporibus
//                       blanditiis dolorem.
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className="sec1 block md:flex justify-around items-center"
//                   data-aos="fade-right"
//                 >
//                   <div>
//                     <h2 className="text-center text-4xl font-bold mb-6 md:text-left">
//                       Supportive Learning Environment
//                     </h2>
//                     <p className="w-[320px] text-lg md:w-[500px] md:text-xl font-semibold">
//                       Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                       Iusto aspernatur provident porro ex optio temporibus
//                       blanditiis dolorem.
//                     </p>
//                     <button className="bg-yellow-500 mt-5 text-lg text-white py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2 md:float-start hover:bg-yellow-600 hover:text-black">
//                       Get in Touch
//                     </button>
//                   </div>
//                   <img
//                     src=""
//                     width="400px"
//                     height="300px"
//                     className="bg-black rounded-[20px]"
//                     alt=""
//                     data-aos="zoom-in"
//                   />
//                 </div>
//               </section>
//             </main>
//           </div>
//         </div>

//         {/* Teachers Section */}
//         <div className="sec3 p-2 flex justify-center items-center">
//           <div className="container mx-auto p-4 sm:p-8">
//             <h1
//               className="text-3xl sm:text-4xl font-bold text-center mb-4"
//               data-aos="fade-up"
//             >
//               Our Teachers
//             </h1>
//             <p className="text-center mb-8" data-aos="fade-up">
//               At stet aliquam nec, mei an dicam posidonium instructior.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {teachers.map((teacher, index) => (
//                 <div
//                   key={index}
//                   className="border rounded-lg p-6 text-center relative shadow-lg"
//                   data-aos="flip-left"
//                   data-aos-delay={index * 100} // Delay animation for each card
//                 >
//                   <div
//                     className={`w-12 h-12 rounded-full absolute -top-6 left-1/2 transform -translate-x-1/2 ${teacher.color}`}
//                   ></div>
//                   <div className="w-40 h-40 rounded-full mx-auto mb-4 bg-white">
//                     <img
//                       src="https://placehold.co/200x200"
//                       alt="Teacher"
//                       className="object-cover w-full h-full rounded-full border-2 border-gray-300"
//                     />
//                   </div>
//                   <h2 className="text-xl font-bold">{teacher.name}</h2>
//                   <p className="text-sm text-blue-500 mb-4">
//                     {teacher.subjects}
//                   </p>
//                   <p>{teacher.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Get Started Section */}
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 h-[30vh]">
//           <div
//             className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-10 rounded-lg flex flex-col md:flex-row items-center justify-between w-11/12 md:w-3/4 gap-6"
//             data-aos="fade-up"
//           >
//             <div className="text-center md:text-left">
//               <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
//                 Get Started Today
//               </h1>
//               <p className="text-white text-base md:text-lg">
//                 At stet aliquam nec, mei an dicam posidonium instructior. Id
//                 iracundia scriptoem disputando mea, omnes corpora ne sed.
//               </p>
//             </div>
//             <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600">
//               START NOW
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
const teachers = [
  {
    name: "Michelle Andrade",
    subjects: "ENGLISH, SPANISH",
    description:
      "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
    color: "bg-yellow-500",
  },
  {
    name: "John Stamos",
    subjects: "ENGLISH, FRENCH, SWEDISH",
    description:
      "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
    color: "bg-teal-500",
  },
  {
    name: "Kelly Masterson",
    subjects: "FRENCH, ENGLISH, SWEDISH",
    description:
      "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
    color: "bg-green-500",
  },
  {
    name: "Michael Wong",
    subjects: "ENGLISH, KOREAN, RUSSIAN",
    description:
      "At stet aliquam nec, mei an dicam posidonium instructior. Id iracundia scriptoem disputando mea, omnes corpora ne sed.",
    color: "bg-blue-500",
  },
];

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <Header />

      <div className=" min-w-[85vw] overflow-hidden bg-white  w-full  mt-44">
        {/* Hero Section */}
        <div
          className="bg-gradient-to-r from-gray-800 to-teal-500 text-center py-12 px-6 sm:py-16"
          data-aos="fade-up"
        >
          <h1 className="text-white text-3xl sm:text-5xl font-bold mb-6">
            Learn With Us. <br /> Improve With Us.
          </h1>
          <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full inline-flex items-center">
            READ MORE
            <i className="fas fa-rocket ml-2"></i>
          </button>
          <div
            className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6 mt-8"
            data-aos="fade-up"
          >
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full sm:w-64">
              <h2 className="text-xl font-bold mb-2">EXPERIENCED FACULTY</h2>
              <a className="text-yellow-500" href="#">
                Learn More &gt;
              </a>
            </div>
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full sm:w-64">
              <h2 className="text-xl font-bold mb-2">800 PLUS STUDENTS</h2>
              <a className="text-yellow-500" href="#">
                Learn More &gt;
              </a>
            </div>
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full sm:w-64">
              <h2 className="text-xl font-bold mb-2">INNOVATIVE KNOWLEDGE</h2>
              <a className="text-yellow-500" href="#">
                Learn More &gt;
              </a>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="py-12 px-6 sm:py-16">
          <div className="container mx-auto px-4">
            <header className="py-6 text-center" data-aos="fade-down">
              <h1 className="text-3xl sm:text-5xl font-bold">What We Offer</h1>
              <p className="text-lg sm:text-xl font-semibold mt-6 w-full md:w-[80vw] mx-auto">
                At Vidya Nidhi Schools, we are committed to nurturing the
                holistic development of our students through a balanced blend of
                academics, co-curricular activities, and value-based education.
              </p>
            </header>

            <main>
              <section className="my-10 flex flex-col gap-12">
                <div
                  className="flex flex-col md:flex-row justify-around items-center"
                  data-aos="fade-right"
                >
                  <div className="md:w-1/2 p-4">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                      Personalized Attention
                    </h2>
                    <p className="text-lg md:text-xl font-semibold">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iusto aspernatur provident porro ex optio temporibus
                      blanditiis dolorem.
                    </p>
                  </div>
                  <img
                    src=""
                    width="300px"
                    height="200px"
                    className="bg-black rounded-[20px]"
                    alt="Personalized Attention"
                  />
                </div>

                <div
                  className="flex flex-col md:flex-row justify-around items-center"
                  data-aos="fade-left"
                >
                  <img
                    src=""
                    width="300px"
                    height="200px"
                    className="bg-black rounded-[20px]"
                    alt="Value-Based Education"
                  />
                  <div className="md:w-1/2 p-4">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                      Value-Based Education
                    </h2>
                    <p className="text-lg md:text-xl font-semibold">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iusto aspernatur provident porro ex optio temporibus
                      blanditiis dolorem.
                    </p>
                  </div>
                </div>

                <div
                  className="flex flex-col md:flex-row justify-around items-center"
                  data-aos="fade-right"
                >
                  <div className="md:w-1/2 p-4">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                      Supportive Learning Environment
                    </h2>
                    <p className="text-lg md:text-xl font-semibold">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iusto aspernatur provident porro ex optio temporibus
                      blanditiis dolorem.
                    </p>
                    <button className="bg-yellow-500 mt-5 text-lg text-white py-2 px-4 rounded hover:bg-yellow-600 hover:text-black">
                      Get in Touch
                    </button>
                  </div>
                  <img
                    src=""
                    width="300px"
                    height="200px"
                    className="bg-black rounded-[20px]"
                    alt="Supportive Learning Environment"
                  />
                </div>
              </section>
            </main>
          </div>
        </div>

        {/* Teachers Section */}
        <div className="p-4 sm:p-8 flex justify-center items-center bg-white">
          <div className="container mx-auto">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4"
              data-aos="fade-up"
            >
              Our Teachers
            </h1>
            <p className="text-center mb-8" data-aos="fade-up">
              At stet aliquam nec, mei an dicam posidonium instructior.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teachers.map((teacher, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 text-center relative shadow-lg"
                  data-aos="flip-left"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`w-12 h-12 rounded-full absolute -top-6 left-1/2 transform -translate-x-1/2 ${teacher.color}`}
                  ></div>
                  <div className="w-40 h-40 rounded-full mx-auto mb-4 bg-white">
                    <img
                      src="https://placehold.co/200x200"
                      alt="Teacher"
                      className="object-cover w-full h-full rounded-full border-2 border-gray-300"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{teacher.name}</h2>
                  <p className="text-sm text-blue-500 mb-4">
                    {teacher.subjects}
                  </p>
                  <p>{teacher.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="flex items-center justify-center min-h-[30vh] bg-gradient-to-r from-blue-500 to-teal-500">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-10 rounded-lg flex flex-col md:flex-row items-center justify-between w-full md:w-3/4 gap-6"
            data-aos="fade-up"
          >
            <div className="text-center md:text-left">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Get Started Today
              </h1>
              <p className="text-white text-base sm:text-lg">
                At stet aliquam nec, mei an dicam posidonium instructior. Id
                iracundia scriptoem disputando mea, omnes corpora ne sed.
              </p>
            </div>
            <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600">
              START NOW
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
