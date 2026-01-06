import { Helmet } from "react-helmet-async";
import EMICalculator from "@/components/EMICalculator";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Smart EMI Calculator | Plan Your Loans Intelligently</title>
        <meta 
          name="description" 
          content="Calculate your EMI instantly with our premium smart calculator. Get AI-powered financial insights, beautiful visualizations, and personalized loan recommendations." 
        />
        <meta name="keywords" content="EMI calculator, loan calculator, home loan EMI, car loan EMI, personal loan calculator, interest calculator" />
      </Helmet>
      <EMICalculator />
    </>
  );
};

export default Index;
