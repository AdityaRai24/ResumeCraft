import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Id } from "@/convex/_generated/dataModel";
import { debounce, set } from "lodash";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import QuillEditorComponent from "../QuillEditors/QuillEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";

const SkillsForm = ({
  item,
  resumeId,
  styles,
}: {
  item: any;
  resumeId: Id<"resumes">;
  styles: any;
}) => {
  const [skillDescription, setSkillDescription] = useState<string>("");
  const [currentFormat, setCurrentFormat] = useState("paragraph");
  const pendingChangesRef = useRef(false);
  const update = useMutation(api.resume.updateSkills);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setSkillDescription(item?.content?.description || "");
    }
  }, [item?.content?.description]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((newSkills: string) => {
        update({ id: resumeId, content: { description: newSkills } });
        pendingChangesRef.current = false;
      }, 400),
    [update, resumeId]
  );

  const handleChange = useCallback(
    (description: string) => {
      pendingChangesRef.current = true;
      setSkillDescription(description);
      debouncedUpdate(description);
    },
    [debouncedUpdate]
  );

  const descriptionObj = [
    {
      heading: "Full Stack Web Developer",
      allDescriptions: [
        `<strong>Frontend :</strong> HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, Redux, Tailwind CSS, Bootstrap, Responsive Design, Flexbox, CSS Grid, Webpack, Babel.`,
        `<strong>Backend :</strong> Node.js, Express.js, REST APIs, GraphQL, Authentication (JWT, OAuth), MongoDB, Mongoose, PostgreSQL, WebSockets (Socket.io), Real-Time Data.`,
        `<strong>DevOps:</strong> Docker, Kubernetes, AWS (S3, EC2, Lambda), DigitalOcean, CI/CD Pipelines (GitHub Actions, Jenkins), Nginx, Apache, PM2.`,
        `<strong>Version Control & Tools: </strong>Git, GitHub, GitLab, Postman, Insomnia, Swagger, VS Code, WebStorm. Testing: Jest, Mocha, Chai, Cypress, Selenium.`,
      ],
    },
    {
      heading: "Data Scientist",
      allDescriptions: [
        `<strong>Programming Languages: </strong>Python, R, SQL, Java.`,
        `<strong>Data Analysis Tools:</strong> Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch, Matplotlib, Seaborn.`,
        `<strong>Databases:</strong> MySQL, PostgreSQL, MongoDB, Redis.`,
        `<strong>Machine Learning:</strong> Regression, Classification, Clustering, Neural Networks, Natural Language Processing.`,
        `<strong>Version Control & Tools:</strong> Git, GitHub, Jupyter, Anaconda, Docker. Testing: PyTest, Unittest.`,
      ],
    },
    {
      heading: "DevOps Engineer",
      allDescriptions: [
        `<strong>Tools & Platforms:</strong> Jenkins, Docker, Kubernetes, GitHub Actions, CircleCI, TravisCI.`,
        `<strong>Cloud Services:</strong> AWS (EC2, S3, Lambda, CloudFormation), Azure, GCP.`,
        `<strong>Automation & Monitoring:</strong> Terraform, Ansible, Nagios, Prometheus, Grafana.`,
        `<strong>Version Control & Tools:</strong> Git, GitLab, GitHub, Bitbucket.`,
        `<strong>Networking & Security:</strong> VPN, SSL, Firewalls, Load Balancing, AWS IAM.`,
      ],
    },
    {
      heading: "Mobile App Developer",
      allDescriptions: [
        `<strong>Languages & Frameworks:</strong> Swift, Kotlin, Java, React Native, Flutter, Dart.`,
        `<strong>Mobile Development Tools:</strong> Xcode, Android Studio, Firebase, Realm, SQLite.`,
        `<strong>Backend:</strong> REST APIs, GraphQL, Node.js, Express.js.`,
        `<strong>Version Control & Tools:</strong> Git, GitHub, Bitbucket, Postman. Testing: Jest, Detox, Espresso.`,
        `<strong>Deployment:</strong> App Store, Google Play, Fastlane.`,
      ],
    },
  ];

  const handleSetDescription = (descriptions: string[]) => {
    const combinedDescription = descriptions.join("<br />");
    setSkillDescription(combinedDescription);
  };

  return (
    <>
      <div className="">
        <QuillEditorComponent
          value={skillDescription}
          onChange={handleChange}
          currentFormat={currentFormat}
          label="Skills Description"
          placeholder="Write Something about your skills"
        />

        <h1 className="text-md font-semibold mt-5">Tailor Your Skillset</h1>
        <p className="text-gray-500 text-sm">
          We recommend you take this only as a reference and personalize it by
          adding your own unique skills.
        </p>

        {descriptionObj.map((item, index) => {
          return (
            <>
              <div className="bg-[#fff] relative hover:scale-[1.005] cursor-pointer transition duration-300 ease-in shadow shadow-primary w-full rounded-lg my-5">
                <div className="w-full group h-full absolute rounded-lg bg-black inset-0 bg-opacity-0 transition hover:bg-opacity-40 duration-300 ease">
                  <div
                    onClick={() => handleSetDescription(item.allDescriptions)}
                    className="group-hover:flex items-center justify-center h-full hidden"
                  >
                    <Button>Use This</Button>
                  </div>
                </div>
                <div className="p-5">
                  <h1 className="font-bold text-2xl">{item.heading}</h1>
                  <p className="text-sm mt-3 font-normal">
                    {item.allDescriptions.map((desc, index) => {
                      return (
                        <li
                          key={index}
                          className="font-normal text-gray-800"
                          dangerouslySetInnerHTML={{ __html: desc }}
                        ></li>
                      );
                    })}
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default SkillsForm;
