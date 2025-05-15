import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_knmustd",
        "template_020bdnh",
        e.target,
        "MHS7WKg9GgQ8ebBX1"
      )
      .then(
        (result) => {
          alert("sent succesufully");
          // toast.success("message sent successfully");
          console.log(result.text);
        },
        (error) => {
          alert("Error sending message.");
          console.log(error.text);
        }
      );

    e.target.reset();
  };

  return (
    <>
      <Header />
      <div className="bg-white w-full max-w-[90vw] overflow-hidden mt-44  sm:min-w-[90vw]">
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4" data-aos="fade-up">
            Contact Us
          </h1>
          <p
            className="text-lg text-gray-600"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            We would love to hear from you! Fill out the form below or reach out
            to us through the contact details provided.
          </p>
        </section>

        {/* Contact Information */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div
            className="p-6 bg-gray-100 rounded-lg shadow-md"
            data-aos="fade-right"
          >
            <h2 className="text-2xl font-bold mb-4">Our Address</h2>
            <p className="text-gray-700 mb-4">
              123 Vidya Nidhi Road, City, Country
            </p>
            <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
            <p className="text-gray-700 mb-4">Email: info@vidyanidhi.com</p>
            <p className="text-gray-700">Phone: +123-456-7890</p>
          </div>

          {/* Google Maps Embed */}
          <div
            className="relative overflow-hidden rounded-lg shadow-md"
            data-aos="fade-left"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.5127888539487!2d-122.41941868468106!3d37.77492927975893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f4f4c77b5%3A0x87629a57c4b3e7b4!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1603896581274!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              aria-hidden="false"
              tabIndex="0"
              title="Google Maps"
            ></iframe>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">
            Get In Touch
          </h2>
          <form
            className="bg-gray-100 p-8 rounded-lg shadow-md "
            onSubmit={sendEmail}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="from_name"
                  className="p-3 border border-gray-300 rounded-lg"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="from_email"
                  className="p-3 border border-gray-300 rounded-lg"
                  placeholder="Your Email"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label className="mb-2 font-semibold" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                className="p-3 border border-gray-300 rounded-lg"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              data-aos="fade-right"
            >
              <h3 className="text-xl font-semibold mb-2">
                What is the school’s admission process?
              </h3>
              <p>
                Our admission process involves filling out an application form,
                attending an interview, and providing the necessary documents.
                For more details, please visit our Admissions page.
              </p>
            </div>
            <div
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              data-aos="fade-left"
            >
              <h3 className="text-xl font-semibold mb-2">
                What are the school’s working hours?
              </h3>
              <p>
                Our school operates from 8:00 AM to 3:00 PM, Monday to Friday.
                For any changes or special schedules, please check our website
                or contact us directly.
              </p>
            </div>
            <div
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              data-aos="fade-right"
            >
              <h3 className="text-xl font-semibold mb-2">
                How can I reach the school administration?
              </h3>
              <p>
                You can reach the school administration by calling us at
                +123-456-7890 or sending an email to info@vidyanidhi.com. We are
                here to assist you with any queries or concerns.
              </p>
            </div>
          </div>
        </section>

        {/* Follow Us Section */}
        <section className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">
            Follow Us
          </h2>
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-yellow-500"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook fa-2x"></i>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-yellow-500"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-yellow-500"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram fa-2x"></i>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-yellow-500"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
