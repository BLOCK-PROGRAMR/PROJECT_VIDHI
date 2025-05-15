import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "emailjs-com";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AdmissionEnquiry() {
  const [formData, setFormData] = useState({
    class: "",
    name: "",
    fatherName: "",
    phone: "",
    reference: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_eaol7a6",
        "template_c1wbn79",
        formData,
        "MHS7WKg9GgQ8ebBX1" // replace with your EmailJS user ID
      )
      .then(
        (result) => {
          console.log("Email sent successfully", result.text);
          alert("Your inquiry has been submitted successfully!");
        },
        (error) => {
          console.log("Error sending email", error.text);
          alert(
            "There was an error submitting your inquiry. Please try again."
          );
        }
      );
    e.target.reset();
  };

  return (
    <>
      <Header />
      <div className="min-w-[85vw]  overflow-hidden mt-44 p-5 rounded-[15px] bg-slate-200 sm:w-full sm:min-w-[90vw]">
        <div className=" mx-auto p-4 ">
          <h1
            className="text-3xl font-bold text-center mb-6"
            data-aos="fade-down"
          >
            Admission Inquiry
          </h1>

          {/* Mission Statement */}
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="mt-2 text-gray-600">
              We aim to provide top-quality education that fosters personal and
              academic growth for every student.
            </p>
          </div>

          {/* Admission Guidelines */}
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-semibold">Admission Guidelines</h2>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Fill out the inquiry form with accurate details.</li>
              <li>
                Our admission team will contact you for further procedure.
              </li>
            </ul>
          </div>

          {/* Form */}
          <form
            className="space-y-4 max-w-[65vw] mx-auto"
            onSubmit={handleSubmit}
            data-aos="fade-up"
          >
            <div>
              <label className="block text-md font-medium text-gray-700">
                <span className="text-red-500">*</span> Class:
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="mt-1 block w-full h-12 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option>Select Class</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full h-12 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Father Name:
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="mt-1 block w-full h-12 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter father's name"
                required
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Phone:
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full h-12  py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Reference:
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="mt-1 block w-full h-12 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter reference"
                required
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Message:
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full h-20 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter message"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Testimonials Section */}
          <div className="mt-12" data-aos="fade-up">
            <h2 className="text-2xl font-semibold">What Our Students Say</h2>
            <blockquote className="mt-4 text-gray-600 italic">
              "This school has truly changed my life. The teachers are
              outstanding, and the environment is incredibly supportive."
            </blockquote>
            <p className="mt-2 text-sm font-medium">- Sarah, Grade 10</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdmissionEnquiry;
