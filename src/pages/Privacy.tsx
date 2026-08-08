import PageLayout from "@/components/PageLayout";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();
  return (
    <PageLayout>
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("privacy.title", "Privacy Policy")}</h1>
      <p className="mb-4">
        {t("privacy.intro", "This privacy policy has been compiled to better serve those who are concerned with how their 'Personally identifiable information' (PII) is being used online. PII, as used in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.")}
      </p>
      <h2 className="text-2xl font-bold mb-2">{t("privacy.whatInfoTitle", "What personal information do we collect from the people that visit our blog, website or app?")}</h2>
      <p className="mb-4">
        {t("privacy.whatInfoDesc", "When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number or other details to help you with your experience.")}
      </p>
      <h2 className="text-2xl font-bold mb-2">{t("privacy.whenCollectTitle", "When do we collect information?")}</h2>
      <p className="mb-4">
        {t("privacy.whenCollectDesc", "We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form or enter information on our site.")}
      </p>
      <h2 className="text-2xl font-bold mb-2">{t("privacy.howUseTitle", "How do we use your information?")}</h2>
      <p className="mb-4">
        {t("privacy.howUseDesc", "We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:")}
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>{t("privacy.usePoint1", "To personalize user's experience and to allow us to deliver the type of content and product offerings in which you are most interested.")}</li>
        <li>{t("privacy.usePoint2", "To improve our website in order to better serve you.")}</li>
        <li>{t("privacy.usePoint3", "To allow us to better service you in responding to your customer service requests.")}</li>
        <li>{t("privacy.usePoint4", "To administer a contest, promotion, survey or other site feature.")}</li>
        <li>{t("privacy.usePoint5", "To quickly process your transactions.")}</li>
        <li>{t("privacy.usePoint6", "To send periodic emails regarding your order or other products and services.")}</li>
      </ul>
    </main>
    </PageLayout>
  );
};

export default Privacy;
