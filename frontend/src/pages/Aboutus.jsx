// import React, { useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";

// function AboutUs() {
//   useEffect(() => {
//     AOS.init({ duration: 1000 }); // Initialize AOS for animations
//   }, []);

//   return (
//     <div className="about-us w-[99vw] mt-36 absolute left-0">
//       <div className="bg-gray-50">
//         {/* Hero Section */}
//         <section
//           className="bg-blue-600 py-12 text-white"
//           data-aos="fade-up"
//           data-aos-delay="200"
//         >
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-4xl font-bold mb-4">About Our School</h1>
//             <p className="text-lg">
//               We are committed to nurturing the next generation of leaders with
//               quality education and values.
//             </p>
//           </div>
//         </section>

//         {/* Mission & Vision Section */}
//         <section className="container mx-auto px-4 py-12">
//           <div className="grid md:grid-cols-2 gap-10">
//             <div
//               className="p-8 bg-white shadow-md rounded-lg"
//               data-aos="fade-right"
//             >
//               <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
//               <p className="text-lg">
//                 Our mission is to provide a safe, inclusive environment where
//                 students can develop academically, socially, and emotionally.
//                 Through dedicated teaching and a strong community, we inspire
//                 lifelong learners.
//               </p>
//             </div>
//             <div
//               className="p-8 bg-white shadow-md rounded-lg"
//               data-aos="fade-left"
//             >
//               <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
//               <p className="text-lg">
//                 We envision a world where every child has access to quality
//                 education, empowering them to make informed decisions,
//                 contribute positively to society, and face challenges
//                 confidently.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* History Section */}
//         <section
//           className="bg-gray-100 py-12"
//           data-aos="fade-up"
//           data-aos-delay="200"
//         >
//           <div className="container mx-auto px-4 text-center">
//             <h2 className="text-3xl font-bold mb-6">Our History</h2>
//             <p className="max-w-3xl mx-auto text-lg">
//               Founded in 1985, our school has been committed to providing
//               excellent education for over three decades. From humble beginnings
//               to a state-of-the-art campus, we continue to grow and innovate
//               while staying true to our core values of integrity, inclusivity,
//               and perseverance.
//             </p>
//           </div>
//         </section>

//         {/* Core Values Section */}
//         <section className="container mx-auto px-4 py-12">
//           <h2
//             className="text-center text-3xl font-bold mb-10"
//             data-aos="fade-up"
//             data-aos-delay="100"
//           >
//             Core Values
//           </h2>
//           <div className="grid md:grid-cols-3 gap-10 text-center">
//             <div
//               className="p-8 bg-white shadow-md rounded-lg"
//               data-aos="flip-left"
//             >
//               <h3 className="text-xl font-bold mb-4">Integrity</h3>
//               <p>
//                 We promote honesty and strong moral principles, ensuring our
//                 students develop a clear sense of right and wrong.
//               </p>
//             </div>
//             <div
//               className="p-8 bg-white shadow-md rounded-lg"
//               data-aos="flip-up"
//             >
//               <h3 className="text-xl font-bold mb-4">Excellence</h3>
//               <p>
//                 We strive for academic and personal excellence, encouraging our
//                 students to reach their full potential.
//               </p>
//             </div>
//             <div
//               className="p-8 bg-white shadow-md rounded-lg"
//               data-aos="flip-right"
//             >
//               <h3 className="text-xl font-bold mb-4">Community</h3>
//               <p>
//                 We foster a strong sense of community where students, teachers,
//                 and parents work together for success.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Facilities Section */}
//         <section
//           className="bg-gray-100 py-12"
//           data-aos="fade-up"
//           data-aos-delay="100"
//         >
//           <div className="container mx-auto px-4 text-center">
//             <h2 className="text-3xl font-bold mb-6">
//               State-of-the-Art Facilities
//             </h2>
//             <p className="text-lg mb-8">
//               Our campus offers a variety of modern facilities designed to
//               create a conducive learning environment for students of all ages.
//             </p>
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {["Library", "Laboratory", "Sports Complex", "Music Room"].map(
//                 (facility, index) => (
//                   <div
//                     key={index}
//                     className="bg-white p-6 rounded-lg shadow-md"
//                     data-aos="zoom-in"
//                     data-aos-delay={index * 200}
//                   >
//                     <img
//                       src={`https://placehold.co/300x200?text=${facility}`}
//                       alt={facility}
//                       className="mx-auto rounded-md mb-4"
//                     />
//                     <h3 className="text-xl font-bold">{facility}</h3>
//                     <p className="text-gray-600">
//                       Our {facility.toLowerCase()} is equipped with the latest
//                       technology and resources for our students.
//                     </p>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Testimonials Section */}
//         <section className="container mx-auto px-4 py-12">
//           <h2
//             className="text-center text-3xl font-bold mb-10"
//             data-aos="fade-up"
//             data-aos-delay="200"
//           >
//             What Parents & Students Say
//           </h2>
//           <div className="grid md:grid-cols-2 gap-10 text-center">
//             {["Parent", "Student"].map((role, index) => (
//               <div
//                 key={index}
//                 className="p-8 bg-white shadow-md rounded-lg"
//                 data-aos="fade-up"
//                 data-aos-delay={index * 300}
//               >
//                 <p className="text-lg mb-4">
//                   "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                   Vivamus efficitur ac dolor vel pretium. Etiam et vehicula
//                   velit."
//                 </p>
//                 <h3 className="text-xl font-bold">{role}</h3>
//                 <p className="text-gray-600">Satisfied {role.toLowerCase()}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Awards & Recognition Section */}
//         <section
//           className="bg-blue-600 py-12 text-white"
//           data-aos="fade-up"
//           data-aos-delay="100"
//         >
//           <div className="container mx-auto px-4 text-center">
//             <h2 className="text-3xl font-bold mb-6">Awards & Recognition</h2>
//             <p className="text-lg mb-8">
//               Our school has been recognized for excellence in education,
//               earning numerous awards over the years.
//             </p>
//             <div className="grid md:grid-cols-3 gap-10">
//               {[
//                 "Excellence in Teaching",
//                 "Community Service",
//                 "Top School Award",
//               ].map((award, index) => (
//                 <div
//                   key={index}
//                   className="bg-white text-blue-600 p-6 rounded-lg shadow-md"
//                   data-aos="flip-up"
//                   data-aos-delay={index * 200}
//                 >
//                   <h3 className="text-xl font-bold">{award}</h3>
//                   <p className="text-gray-600">
//                     Awarded for our dedication to {award.toLowerCase()}.
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Meet Our Team Section */}
//         <section className="bg-blue-50 py-12">
//           <div className="container mx-auto px-4 text-center">
//             <h2
//               className="text-3xl font-bold mb-6"
//               data-aos="fade-up"
//               data-aos-delay="200"
//             >
//               Meet Our Team
//             </h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//               {[
//                 "Principal",
//                 "Vice Principal",
//                 "Senior Teacher",
//                 "Counselor",
//               ].map((role, index) => (
//                 <div
//                   key={index}
//                   className="bg-white p-6 rounded-lg shadow-md"
//                   data-aos="zoom-in"
//                   data-aos-delay={index * 200}
//                 >
//                   <img
//                     src={`https://placehold.co/150x150?text=${role}`}
//                     alt={role}
//                     className="mx-auto rounded-full mb-4"
//                   />
//                   <h3 className="text-xl font-bold">{role}</h3>
//                   <p className="text-gray-600">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Call to Action */}
//         <section
//           className="bg-blue-600 py-12 text-center text-white"
//           data-aos="fade-up"
//           data-aos-delay="100"
//         >
//           <div className="container mx-auto px-4">
//             <h2 className="text-3xl font-bold mb-6">Join Us Today</h2>
//             <p className="text-lg mb-8">
//               Ready to be part of a vibrant learning community? Enroll your
//               child today and start their journey with us.
//             </p>
//             <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600">
//               ENROLL NOW
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default AboutUs;
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS for animations
  }, []);

  return (
    <>
      <Header />
      <div className="bg-white w-full max-w-[90vw]  overflow-hidden mt-44  sm:min-w-[90vw]">
        <div className=" w-full ">
          {/* Hero Section */}
          <section
            className="bg-blue-600 py-12 text-white"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                About Our School
              </h1>
              <p className="text-lg sm:text-xl">
                We are committed to nurturing the next generation of leaders
                with quality education and values.
              </p>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div
                className="p-8 bg-white shadow-md rounded-lg"
                data-aos="fade-right"
              >
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg">
                  Our mission is to provide a safe, inclusive environment where
                  students can develop academically, socially, and emotionally.
                  Through dedicated teaching and a strong community, we inspire
                  lifelong learners.
                </p>
              </div>
              <div
                className="p-8 bg-white shadow-md rounded-lg"
                data-aos="fade-left"
              >
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg">
                  We envision a world where every child has access to quality
                  education, empowering them to make informed decisions,
                  contribute positively to society, and face challenges
                  confidently.
                </p>
              </div>
            </div>
          </section>

          {/* History Section */}
          <section
            className="bg-gray-100 py-12"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Our History
              </h2>
              <p className="max-w-3xl mx-auto text-lg sm:text-xl">
                Founded in 1985, our school has been committed to providing
                excellent education for over three decades. From humble
                beginnings to a state-of-the-art campus, we continue to grow and
                innovate while staying true to our core values of integrity,
                inclusivity, and perseverance.
              </p>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="container mx-auto px-4 py-12">
            <h2
              className="text-center text-2xl sm:text-3xl font-bold mb-10"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Core Values
            </h2>
            <div className="grid gap-10 text-center md:grid-cols-3">
              <div
                className="p-8 bg-white shadow-md rounded-lg"
                data-aos="flip-left"
              >
                <h3 className="text-xl font-bold mb-4">Integrity</h3>
                <p>
                  We promote honesty and strong moral principles, ensuring our
                  students develop a clear sense of right and wrong.
                </p>
              </div>
              <div
                className="p-8 bg-white shadow-md rounded-lg"
                data-aos="flip-up"
              >
                <h3 className="text-xl font-bold mb-4">Excellence</h3>
                <p>
                  We strive for academic and personal excellence, encouraging
                  our students to reach their full potential.
                </p>
              </div>
              <div
                className="p-8 bg-white shadow-md rounded-lg"
                data-aos="flip-right"
              >
                <h3 className="text-xl font-bold mb-4">Community</h3>
                <p>
                  We foster a strong sense of community where students,
                  teachers, and parents work together for success.
                </p>
              </div>
            </div>
          </section>

          {/* Facilities Section */}
          <section
            className="bg-gray-100 py-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                State-of-the-Art Facilities
              </h2>
              <p className="text-lg mb-8 sm:text-xl">
                Our campus offers a variety of modern facilities designed to
                create a conducive learning environment for students of all
                ages.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {["Library", "Laboratory", "Sports Complex", "Music Room"].map(
                  (facility, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md"
                      data-aos="zoom-in"
                      data-aos-delay={index * 200}
                    >
                      <img
                        src={`https://placehold.co/300x200?text=${facility}`}
                        alt={facility}
                        className="mx-auto rounded-md mb-4"
                      />
                      <h3 className="text-xl font-bold">{facility}</h3>
                      <p className="text-gray-600">
                        Our {facility.toLowerCase()} is equipped with the latest
                        technology and resources for our students.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="container mx-auto px-4 py-12">
            <h2
              className="text-center text-2xl sm:text-3xl font-bold mb-10"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              What Parents & Students Say
            </h2>
            <div className="grid gap-10 md:grid-cols-2 text-center">
              {["Parent", "Student"].map((role, index) => (
                <div
                  key={index}
                  className="p-8 bg-white shadow-md rounded-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 300}
                >
                  <p className="text-lg sm:text-xl mb-4">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus efficitur ac dolor vel pretium. Etiam et vehicula
                    velit."
                  </p>
                  <h3 className="text-xl font-bold">{role}</h3>
                  <p className="text-gray-600">
                    Satisfied {role.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Awards & Recognition Section */}
          <section
            className="bg-blue-600 py-12 text-white"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Awards & Recognition
              </h2>
              <p className="text-lg sm:text-xl mb-8">
                Our school has been recognized for excellence in education,
                earning numerous awards over the years.
              </p>
              <div className="grid gap-10 md:grid-cols-3">
                {[
                  "Excellence in Teaching",
                  "Community Service",
                  "Top School Award",
                ].map((award, index) => (
                  <div
                    key={index}
                    className="bg-white text-blue-600 p-6 rounded-lg shadow-md"
                    data-aos="flip-up"
                    data-aos-delay={index * 200}
                  >
                    <h3 className="text-xl font-bold">{award}</h3>
                    <p className="text-gray-600">
                      Awarded for our dedication to {award.toLowerCase()}.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Meet Our Team Section */}
          <section className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Meet Our Team
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  "Principal",
                  "Vice Principal",
                  "Senior Teacher",
                  "Counselor",
                ].map((role, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md"
                    data-aos="zoom-in"
                    data-aos-delay={index * 200}
                  >
                    <img
                      src={`https://placehold.co/150x150?text=${role}`}
                      alt={role}
                      className="mx-auto rounded-full mb-4"
                    />
                    <h3 className="text-xl font-bold">{role}</h3>
                    <p className="text-gray-600">
                      {" "}
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                    </p>{" "}
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Call to Action */}
          <section
            className="bg-blue-600 py-12 text-center text-white"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Join Us Today
              </h2>
              <p className="text-lg mb-8">
                Ready to be part of a vibrant learning community? Enroll your
                child today and start their journey with us.
              </p>
              <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600">
                ENROLL NOW
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
