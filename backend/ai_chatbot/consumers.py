import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
from .utils.Preprocess import Preprocess
from .model.intent.IntentModel import IntentModel
from .model.sim.SimModel import SimModel
from .utils.FindAnswer import FindAnswer
from .model.ner.NerModel import NerModel

# 전역 모델 캐시 (모듈 레벨에서 관리)
_global_models = {
    'preprocess': None,
    'intent': None,
    'sim': None,
    'ner': None,
    'loading': False,
    'loaded': False
}

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
        # 🔧 개선: __init__에서는 모델 로딩하지 않음
        self.models_ready = False
        print("=== ChatConsumer 인스턴스 생성 ===")

    async def connect(self):
        try:
            print("=== WebSocket connect() 시작 ===")
            # 🔧 즉시 연결 수락
            await self.accept()
            print("=== WebSocket connect() 완료 ===")
            
            # 🔧 백그라운드에서 모델 로딩
            asyncio.create_task(self.initialize_models())
            
        except Exception as e:
            print(f"WebSocket connect() 오류: {e}")
            import traceback
            traceback.print_exc()
            await self.close()

    async def accept(self, subprotocol=None):
        try:
            print("=== WebSocket accept() 시작 ===")
            await super().accept(subprotocol=subprotocol)
            print("=== WebSocket accept() 완료 ===")
            
            # 🔧 연결 확인 메시지만 전송
            await self.send_json({
                "Answer": "연결되었습니다. 챗봇을 준비하고 있습니다...",
                "Status": "connecting"
            })
            
        except Exception as e:
            print(f"WebSocket accept() 오류: {e}")
            import traceback
            traceback.print_exc()
            await self.close()

    async def initialize_models(self):
        """비동기적으로 AI 모델들을 로딩합니다."""
        global _global_models
        
        try:
            # 이미 로딩 중이거나 완료된 경우 대기 또는 즉시 반환
            if _global_models['loaded']:
                self.p = _global_models['preprocess']
                self.intent = _global_models['intent'] 
                self.sim = _global_models['sim']
                self.ner = _global_models['ner']
                self.models_ready = True
                
                await self.send_json({
                    "Answer": "안녕하세요! 릉주대 챗봇 강원동입니다. 저희는 사이트 내 데이터에 기반하고 있지만, 데이터가 업데이트 되지 않아 달라진 부분이 있을 수 있으니, 중요한 내용은 꼭 해당 동아리에 문의하시기 바랍니다. 무엇을 도와드릴까요?",
                    "Status": "ready"
                })
                return
            
            # 다른 인스턴스가 로딩 중인 경우 대기
            if _global_models['loading']:
                print("=== 다른 인스턴스가 모델 로딩 중, 대기 ===")
                while _global_models['loading'] and not _global_models['loaded']:
                    await asyncio.sleep(1)
                
                if _global_models['loaded']:
                    self.p = _global_models['preprocess']
                    self.intent = _global_models['intent']
                    self.sim = _global_models['sim'] 
                    self.ner = _global_models['ner']
                    self.models_ready = True
                    
                    await self.send_json({
                        "Answer": "안녕하세요! 릉주대 챗봇 강원동입니다. 저희는 사이트 내 데이터에 기반하고 있지만, 데이터가 업데이트 되지 않아 달라진 부분이 있을 수 있으니, 중요한 내용은 꼭 해당 동아리에 문의하시기 바랍니다. 무엇을 도와드릴까요?",
                        "Status": "ready"
                    })
                return
            
            # 첫 번째 인스턴스가 모델 로딩 시작
            _global_models['loading'] = True
            print("=== AI 모델 로딩 시작 ===")
            
            await self.send_json({
                "Answer": "AI 모델을 로딩하고 있습니다. 잠시만 기다려주세요...",
                "Status": "loading"
            })

            # 🔧 동기 작업을 executor에서 실행
            loop = asyncio.get_event_loop()
            
            print("Preprocess 초기화 중...")
            self.p = await loop.run_in_executor(None, lambda: Preprocess(
                word2index_dic='ai_chatbot/train_tools/dict/chatbot_dict.bin',
                userdic='ai_chatbot/utils/user_dic.tsv'
            ))
            print("Preprocess 초기화 완료")

            print("IntentModel 로딩 중...")
            self.intent = await loop.run_in_executor(None, lambda: IntentModel(
                model_name='ai_chatbot/model/intent_model_new.h5', 
                preprocess=self.p
            ))
            print("IntentModel 로딩 완료")

            print("SimModel 로딩 중...")
            self.sim = await loop.run_in_executor(None, lambda: SimModel(preprocess=self.p))
            print("SimModel 로딩 완료")

            print("NerModel 로딩 중...")
            self.ner = await loop.run_in_executor(None, lambda: NerModel(
                model_name='ai_chatbot/model/ner_model_new.h5', 
                proprocess=self.p
            ))
            print("NerModel 로딩 완료")

            # 전역 캐시에 저장
            _global_models['preprocess'] = self.p
            _global_models['intent'] = self.intent
            _global_models['sim'] = self.sim
            _global_models['ner'] = self.ner
            _global_models['loaded'] = True
            _global_models['loading'] = False
            
            self.models_ready = True
            print("=== AI 모델 로딩 완료 ===")

            # 로딩 완료 메시지 전송
            await self.send_json({
                "Answer": "안녕하세요! 릉주대 챗봇 강원동입니다. 저희는 사이트 내 데이터에 기반하고 있지만, 데이터가 업데이트 되지 않아 달라진 부분이 있을 수 있으니, 중요한 내용은 꼭 해당 동아리에 문의하시기 바랍니다. 무엇을 도와드릴까요?",
                "Status": "ready"
            })

        except Exception as e:
            print(f"AI 모델 로딩 오류: {e}")
            import traceback
            traceback.print_exc()
            
            _global_models['loading'] = False
            
            await self.send_json({
                "Answer": "죄송합니다. 챗봇 초기화 중 오류가 발생했습니다. 서버 관리자에게 문의해주세요.",
                "Status": "error"
            })

    async def disconnect(self, close_code):
        print(f"=== WebSocket 연결 종료: {close_code} ===")

    async def receive_json(self, content, **kwargs):
        try:
            query = content.get('Query', '').strip()
            
            if not query:
                await self.send_json({
                    "Answer": "질문을 입력해주세요.",
                    "Status": "error"
                })
                return

            # 🔧 모델 준비 상태 확인
            if not self.models_ready:
                await self.send_json({
                    "Answer": "챗봇을 준비하고 있습니다. 잠시만 기다려주세요...",
                    "Status": "loading"
                })
                return

            print(f"=== 사용자 질문: {query} ===")

            # AI 처리 (기존 로직)
            intent_perdict = self.intent.predict_class(query)
            intent_name = self.intent.labels[intent_perdict]
            print(f"의도 분석 결과: {intent_name}")

            # 질문 임베딩
            embedding_data = self.sim.create_pt(query)

            ner_predicts = self.ner.predict(query)
            print(f"개체명 인식 결과: {ner_predicts}")

            # 답변 검색
            f = FindAnswer()
            answer_text = "아직 학습하지 않은 영역입니다."
            answer_image = ""

            if f is not None:
                if intent_name == '인사' or intent_name == '욕설' or intent_name == '기타':
                    answer_text, answer_image = await f.search_1(intent_name)
                    print("패턴 1 실행")

                elif intent_name == '생성':
                    answer_text, answer_image = await f.search_2(intent_name, embedding_data)
                    print("패턴 2 실행")

                else:
                    # 개체명 파악
                    tagged_text = f.tag_to_word(ner_predicts)
                    print(f"태그된 텍스트: {tagged_text}")
                    answer_text, answer_image = await f.search_3(intent_name, tagged_text, embedding_data)
                    print("패턴 3 실행")

            print(f"=== 최종 답변: {answer_text} ===")

            await self.send_json({
                "Query": query,
                "Answer": answer_text,
                "AnswerImageUrl": answer_image,
                "Intent": intent_name,
                "NER": str(ner_predicts),
                "Status": "success"
            })

        except Exception as e:
            print(f"메시지 처리 오류: {e}")
            import traceback
            traceback.print_exc()
            
            await self.send_json({
                'Answer': '죄송합니다. 메시지 처리 중 오류가 발생했습니다.',
                'Status': 'error'
            })