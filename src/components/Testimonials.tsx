import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content:
      "SaaSify transformed our brand presence. The AI-powered tools saved us countless hours in design and marketing.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Michael Chen",
    role: "Founder, GrowthLabs",
    content:
      "The e-commerce integration is seamless. We've seen a 200% increase in sales since switching to SaaSify.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Emma Davis",
    role: "Marketing Director, Innovate",
    content:
      "Customer support is exceptional. They're always there to help and the platform is incredibly user-friendly.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=3",
  },
];

const Testimonials = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by Businesses Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with SaaSify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;