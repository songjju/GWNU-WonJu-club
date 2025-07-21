import json
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
# from ai_chatbot.config import DatabaseConfig, GlobalParams
# from ai_chatbot.utils.Database import Database
# from utils.BotServer import BotServer
from .utils.Preprocess import Preprocess
from .model.intent.IntentModel import IntentModel
from .model.sim.SimModel import SimModel
from .utils.FindAnswer import FindAnswer
# from ai_chatbot.utils.save_conversation import save_conversation
from .model.ner.NerModel import NerModel


class YourConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

class ChatConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            print("=== ChatConsumer 초기화 시작 ===")
            
            print("Preprocess 초기화 중...")
            # 전처리 객체 생성
            self.p = Preprocess(word2index_dic='ai_chatbot/train_tools/dict/chatbot_dict.bin',
                   userdic='ai_chatbot/utils/user_dic.tsv')
            print("Preprocess 초기화 완료")

            print("IntentModel 로딩 중...")
            # 의도 파악 모델
            # self.intent = IntentModel(model_name='ai_chatbot/model/intent/intent_model.keras', preprocess=self.p)
            self.intent = IntentModel(model_name='ai_chatbot/model/intent_model_new.h5', preprocess=self.p)
            print("IntentModel 로딩 완료")

            print("SimModel 로딩 중...")
            # 유사도 분석 모델
            self.sim = SimModel(preprocess=self.p)
            print("SimModel 로딩 완료")

            print("NerModel 로딩 중...")
            # 개체명 인식 모델
            self.ner = NerModel(model_name='ai_chatbot/model/ner_model_new.h5', proprocess=self.p)
            print("NerModel 로딩 완료")

            print("=== ChatConsumer 초기화 완료 ===")

        except Exception as e:
            print(f"ChatConsumer 초기화 오류: {e}")
            import traceback
            traceback.print_exc()
            raise

    async def connect(self):
        try:
            print("=== WebSocket connect() 시작 ===")
            await self.accept()
            print("=== WebSocket connect() 완료 ===")
        except Exception as e:
            print(f"WebSocket connect() 오류: {e}")
            import traceback
            traceback.print_exc()
            raise

    async def accept(self, subprotocol=None):
        try:
            print("=== WebSocket accept() 시작 ===")
            await super().accept(subprotocol=subprotocol)
            print("=== super().accept() 완료 ===")

            start_message = ("안녕하세요! 릉주대 챗봇 강원동입니다. 저희는 사이트 내 데이터에 기반하고 있지만, 데이터가 업데이트 되지 않아 달라진 부분이 있을 수 있으니, 중요한 내용은 꼭 "
                             "해당 동아리에 문의하시기 바랍니다. 무엇을 도와드릴까요?")
            print("=== 시작 메시지 전송 중 ===")
            await self.send_json({"Answer": start_message})
            print("=== 시작 메시지 전송 완료 ===")
            print("=== WebSocket accept() 완료 ===")
        except Exception as e:
            print(f"WebSocket accept() 오류: {e}")
            import traceback
            traceback.print_exc()
            raise

    async def disconnect(self, close_code):
        pass

    async def receive_json(self, content, **kwargs):
        try:
            query = content['Query']  # json 파싱

            intent_perdict = self.intent.predict_class(query)
            intent_name = self.intent.labels[intent_perdict]
            print(intent_name)

            # 질문 임베딩
            embedding_data = self.sim.create_pt(query)

            ner_predicts = self.ner.predict(query)

            # 답변 검색
            f = FindAnswer()
            answer_text = "아직 학습하지 않은 영역입니다."
            answer_image = ""

            if f is not None:
                if intent_name == '인사' or intent_name == '욕설' or intent_name == '기타':
                    answer_text, answer_image = await f.search_1(intent_name)
                    print("1111")

                elif intent_name == '생성':
                    answer_text, answer_image = await f.search_2(intent_name, embedding_data)
                    print("2222")

                else:
                    # 개체명 파악
                    tagged_text = f.tag_to_word(ner_predicts)
                    print(tagged_text, type(tagged_text))
                    answer_text, answer_image = await f.search_3(intent_name, tagged_text, embedding_data)
                    print("3333")

            print(""" "Answer": answer_text """, answer_text)

            await self.send_json({
                    "Query": query,
                    "Answer": answer_text,
                    "AnswerImageUrl": answer_image,
                    "Intent": intent_name,
                    "NER": str(ner_predicts)
            })

        except Exception as e:
            await self.send_json({'error': str(e)})
