import { Link, createLazyFileRoute } from '@tanstack/react-router';

function Home() {
    return (
        <section className="flex grow flex-col place-items-start justify-center gap-3 place-self-stretch text-balance p-20">
            <h1 className="mb-5 text-4xl">Привет! 👋</h1>
            <p>
                Давайте начнем тест. Время на прохождение теста: <strong>15 минут.</strong>
            </p>
            <p>
                Тест состоит из 20 вопросов. Типы вопросов: выбор одного варианта, выбор нескольких вариантов, короткий
                ответ, развернутый ответ.
            </p>
            <p>После прохождения теста вы увидите результаты и сможете посмотреть правильные ответы.</p>
            <Link to="/test" className="btn btn-primary self-center">
                Начать тест
            </Link>
        </section>
    );
}

export const Route = createLazyFileRoute('/')({
    component: Home,
});

export default Route;
