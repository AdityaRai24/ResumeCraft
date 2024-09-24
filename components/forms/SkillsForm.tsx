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


  const bulletPoints = `<ul class="bullet-ul">
      <div>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
        <li>React</li>
        <li>Vue.js</li>
        <li>Responsive design</li>
        <li>Interactive web applications</li>
      </div>
      <div>
        <li>Node.js</li>
        <li>Python</li>
        <li>RESTful API design</li>
        <li>Express.js</li>
        <li>Django</li>
      </div>
      <div>
        <li>SQL</li>
        <li>MySQL</li>
        <li>PostgreSQL</li>
        <li>NoSQL</li>
        <li>MongoDB</li>
        <li>Database schema design</li>
        <li>Complex query writing</li>
      </div>
      <div>
        <li>Docker</li>
        <li>Kubernetes</li>
        <li>AWS</li>
        <li>Google Cloud Platform</li>
        <li>Containerization</li>
        <li>Cloud deployment</li>
        <li>Application management</li>
      </div>
    </ul>`

  const paracontent = ` <p>
              <strong class="bold-please">Frontend:</strong> HTML, CSS,
              JavaScript, React, Vue.js, responsive design, interactive web
              applications
            </p>
            <p>
              <strong  style={{font:"bold"}}>Backend:</strong> Node.js, Python,
              RESTful API design, Express.js, Django
            </p>
            <p>
              <strong  style={{font:"bold"}}>Database:</strong> SQL, MySQL,
              PostgreSQL, NoSQL, MongoDB, database schema design, complex query
              writing
            </p>
            <p>
              <strong  style={{font:"bold"}}>DevOps:</strong> Docker, Kubernetes,
              AWS, Google Cloud Platform, containerization, cloud deployment,
              application management
            </p>`;

  return (
    <>
      <div className="">
        <QuillEditorComponent
          value={skillDescription}
          onChange={handleChange}
          currentFormat={currentFormat}
          label="Description"
        />
      </div>

      {/* <p className="font-light px-2 mt-4 pb-3">
        You can also choose some of the pre written texts to speed up your
        process...
      </p>
      <Tabs defaultValue="paragraph" className=" pb-6">
        <TabsList>
          <TabsTrigger
            onClick={() => setCurrentFormat("paragraph")}
            value="paragraph"
          >
            Paragraph
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setCurrentFormat("bullet_points")}
            value="bullet_points"
          >
            Bullet Points
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setCurrentFormat("two_columns")}
            value="two_columns"
          >
            Two Column
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setCurrentFormat("level_bars")}
            value="level_bars"
          >
            Level Bars
          </TabsTrigger>
        </TabsList>
        <TabsContent value="paragraph" className="mt-6">
          <div
            onClick={() => setSkillDescription(paracontent)}
            className="font-light w-full bg-white p-6 rounded-md shadow-sm shadow-primary"
          >
            <p>
              <span className="font-bold">Frontend:</span> HTML, CSS,
              JavaScript, React, Vue.js, responsive design, interactive web
              applications
            </p>
            <p>
              {" "}
              <span className="font-bold">Backend:</span> Node.js, Python,
              RESTful API design, Express.js, Django
            </p>
            <p>
              <span className="font-bold">Database:</span> SQL, MySQL,
              PostgreSQL, NoSQL, MongoDB, database schema design, complex query
              writing
            </p>
            <p>
              <span className="font-bold">DevOps:</span> Docker, Kubernetes,
              AWS, Google Cloud Platform, containerization, cloud deployment,
              application management
            </p>
          </div>
        </TabsContent>

        <TabsContent value="bullet_points" className="mt-6">
          <div
            onClick={() => setSkillDescription(bulletPoints)}
            className="font-light w-full bg-white p-6 rounded-md shadow-sm shadow-primary"
          >
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p>
                  <span className="font-bold">Frontend:</span>
                </p>
                <ul className="list-disc pl-5">
                  <li>HTML</li>
                  <li>CSS</li>
                  <li>JavaScript</li>
                  <li>React</li>
                  <li>Vue.js</li>
                  <li>Responsive design</li>
                  <li>Interactive web applications</li>
                </ul>
              </div>
              <div>
                <p>
                  <span className="font-bold">Backend:</span>
                </p>
                <ul className="list-disc pl-5">
                  <li>Node.js</li>
                  <li>Python</li>
                  <li>RESTful API design</li>
                  <li>Express.js</li>
                  <li>Django</li>
                </ul>
              </div>
              <div>
                <p>
                  <span className="font-bold">Database:</span>
                </p>
                <ul className="list-disc pl-5">
                  <li>SQL</li>
                  <li>MySQL</li>
                  <li>PostgreSQL</li>
                  <li>NoSQL</li>
                  <li>MongoDB</li>
                  <li>Database schema design</li>
                  <li>Complex query writing</li>
                </ul>
              </div>
              <div>
                <p>
                  <span className="font-bold">DevOps:</span>
                </p>
                <ul className="list-disc pl-5">
                  <li>Docker</li>
                  <li>Kubernetes</li>
                  <li>AWS</li>
                  <li>Google Cloud Platform</li>
                  <li>Containerization</li>
                  <li>Cloud deployment</li>
                  <li>Application management</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs> */}
    </>
  );
};

export default SkillsForm;
