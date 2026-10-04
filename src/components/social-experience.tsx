import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImagePlus,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Share2,
  UserPlus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import socialPrato from "@/assets/social-prato.jpg";
import socialLuana from "@/assets/social-luana.jpg";
import socialPizza from "@/assets/social-pizza.jpg";
import socialFeira from "@/assets/social-feira.jpg";
import boloChocolate from "@/assets/bolo-chocolate.jpg";
import limonadaRosa from "@/assets/limonada-rosa.jpg";

type SocialScreen = "feed" | "profile" | "create" | "post";

type SocialExperienceProps = {
  initialScreen?: "feed" | "profile" | "create";
};

type Author = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  image?: string;
  verified?: boolean;
  bio: string;
  followers: string;
  following: string;
};

type Post = {
  id: string;
  author: Author;
  image: string;
  location: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
};

const authors: Record<string, Author> = {
  sabor: {
    id: "sabor",
    name: "Sabor Mineiro",
    handle: "sabormineiro",
    initials: "SM",
    verified: true,
    bio: "Comida mineira feita com afeto. Almoço fresquinho todos os dias.",
    followers: "12,8 mil",
    following: "486",
  },
  luana: {
    id: "luana",
    name: "Luana Costa",
    handle: "luanacosta",
    initials: "LC",
    image: socialLuana,
    bio: "Comida, lugares e bons encontros por BH.",
    followers: "8.420",
    following: "612",
  },
  pizza: {
    id: "pizza",
    name: "Pizzaria do Bairro",
    handle: "pizzariadobairro",
    initials: "PB",
    image: socialPizza,
    verified: true,
    bio: "Pizza artesanal, forno a lenha e ingredientes de verdade.",
    followers: "18,2 mil",
    following: "318",
  },
  marina: {
    id: "marina",
    name: "Marina Alves",
    handle: "marinaalves",
    initials: "MA",
    image: socialFeira,
    bio: "Fotógrafa, viajante e apaixonada pelas ruas da cidade.",
    followers: "4.911",
    following: "527",
  },
};

const posts: Post[] = [
  {
    id: "prato",
    author: authors.sabor,
    image: socialPrato,
    location: "Belo Horizonte, MG",
    caption: "O clássico que abraça: arroz soltinho, feijão cremoso, bife e tudo que um almoço mineiro merece. 💚",
    likes: 1284,
    comments: 86,
    time: "há 18 min",
  },
  {
    id: "luana",
    author: authors.luana,
    image: socialLuana,
    location: "Centro Histórico",
    caption: "Almoço gostoso, conversa boa e uma pausa do jeito que eu precisava hoje.",
    likes: 842,
    comments: 41,
    time: "há 46 min",
  },
  {
    id: "pizza",
    author: authors.pizza,
    image: socialPizza,
    location: "Pizzaria do Bairro",
    caption: "Saindo do forno! Massa de fermentação lenta e aquele sabor que transforma a noite. 🍕",
    likes: 2103,
    comments: 124,
    time: "há 2 h",
  },
  {
    id: "feira",
    author: authors.marina,
    image: socialFeira,
    location: "Feira da manhã",
    caption: "Cores, encontros e histórias em cada corredor. Minha manhã favorita da semana.",
    likes: 634,
    comments: 29,
    time: "há 3 h",
  },
];

const storyAuthors = [authors.sabor, authors.luana, authors.pizza, authors.marina];

function Avatar({ author, size = "md" }: { author: Author; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-20" : size === "sm" ? "size-9" : "size-11";
  return author.image ? (
    <img
      src={author.image}
      alt={`Foto de ${author.name}`}
      width={1024}
      height={1024}
      loading="lazy"
      className={cn(sizeClass, "shrink-0 rounded-full object-cover")}
    />
  ) : (
    <span className={cn(sizeClass, "grid shrink-0 place-items-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground")}>
      {author.initials}
    </span>
  );
}

export function SocialExperience({ initialScreen = "feed" }: SocialExperienceProps) {
  const [screen, setScreen] = useState<SocialScreen>(initialScreen);
  const [selectedAuthor, setSelectedAuthor] = useState<Author>(authors.sabor);
  const [selectedPost, setSelectedPost] = useState<Post>(posts[0]);
  const [liked, setLiked] = useState<string[]>(["pizza"]);
  const [saved, setSaved] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(["sabor", "luana"]);
  const [story, setStory] = useState<Author | null>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const openProfile = (author: Author) => {
    setSelectedAuthor(author);
    setScreen("profile");
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setScreen("post");
  };

  const toggleList = (id: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <section className="relative h-full min-h-0 overflow-hidden bg-background">
      {screen === "feed" && (
        <Feed
          search={search}
          onSearch={setSearch}
          liked={liked}
          saved={saved}
          onLike={(id) => toggleList(id, setLiked)}
          onSave={(id) => toggleList(id, setSaved)}
          onProfile={openProfile}
          onPost={openPost}
          onStory={setStory}
          onCreate={() => setScreen("create")}
          onNotice={showNotice}
        />
      )}
      {screen === "profile" && (
        <ProfileView
          author={selectedAuthor}
          following={following.includes(selectedAuthor.id)}
          onFollow={() => toggleList(selectedAuthor.id, setFollowing)}
          onBack={() => setScreen("feed")}
          onPost={openPost}
          onNotice={showNotice}
        />
      )}
      {screen === "create" && (
        <CreatePost onBack={() => setScreen("feed")} onPublish={() => { showNotice("Publicação compartilhada"); setScreen("feed"); }} />
      )}
      {screen === "post" && (
        <PostDetail
          post={selectedPost}
          liked={liked.includes(selectedPost.id)}
          saved={saved.includes(selectedPost.id)}
          onLike={() => toggleList(selectedPost.id, setLiked)}
          onSave={() => toggleList(selectedPost.id, setSaved)}
          onBack={() => setScreen("profile")}
          onProfile={() => openProfile(selectedPost.author)}
          onNotice={showNotice}
        />
      )}

      {story && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-foreground/85 p-4">
          <div className="relative aspect-[9/16] h-[min(84vh,720px)] overflow-hidden rounded-lg bg-card shadow-xl">
            <img src={story.image ?? socialPrato} alt={`Story de ${story.name}`} width={1024} height={1024} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-foreground/70 to-transparent p-4 pt-5">
              <div className="mb-4 h-0.5 overflow-hidden rounded-full bg-card/40"><div className="h-full w-2/3 bg-card" /></div>
              <div className="flex items-center gap-3 text-primary-foreground"><Avatar author={story} size="sm" /><span className="text-sm font-bold">{story.handle}</span><span className="text-xs opacity-80">12 min</span></div>
            </div>
            <Button aria-label="Fechar story" title="Fechar" variant="ghost" size="icon" onClick={() => setStory(null)} className="absolute right-3 top-12 text-primary-foreground hover:bg-card/15 hover:text-primary-foreground"><X /></Button>
            <div className="absolute inset-x-4 bottom-5 flex items-center gap-2"><div className="h-11 flex-1 rounded-full border border-card/70 px-4 py-3 text-sm text-primary-foreground">Responder para {story.name.split(" ")[0]}...</div><Button size="icon" className="rounded-full" onClick={() => { setStory(null); showNotice("Resposta enviada"); }}><Send /></Button></div>
          </div>
        </div>
      )}

      {notice && <div className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background shadow-lg lg:bottom-6">{notice}</div>}
    </section>
  );
}

function Feed({ search, onSearch, liked, saved, onLike, onSave, onProfile, onPost, onStory, onCreate, onNotice }: {
  search: string;
  onSearch: (value: string) => void;
  liked: string[];
  saved: string[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onProfile: (author: Author) => void;
  onPost: (post: Post) => void;
  onStory: (author: Author) => void;
  onCreate: () => void;
  onNotice: (text: string) => void;
}) {
  const visiblePosts = posts.filter((post) => `${post.author.name} ${post.caption}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="h-full overflow-y-auto">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div><p className="font-display text-lg font-bold">Para você</p><p className="text-xs text-muted-foreground">Novidades de quem você segue</p></div>
          <div className="hidden w-full max-w-xs items-center gap-2 rounded-full bg-muted px-4 sm:flex"><Search className="size-4 text-muted-foreground" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar pessoas e publicações" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></div>
          <Button onClick={onCreate} className="gap-2 rounded-full px-4"><ImagePlus /><span className="hidden sm:inline">Publicar</span></Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-7 px-0 py-4 sm:px-6 lg:grid-cols-[minmax(0,620px)_300px] lg:justify-center lg:py-7">
        <div className="min-w-0 space-y-5">
          <div className="border-y border-border bg-card px-4 py-4 sm:rounded-lg sm:border">
            <div className="flex gap-4 overflow-x-auto pb-1">
              <Button variant="ghost" className="h-auto w-16 shrink-0 flex-col gap-2 p-0" onClick={onCreate}>
                <span className="relative"><Avatar author={authors.luana} /><span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground"><ImagePlus className="size-3" /></span></span><span className="w-full truncate text-[10px]">Seu story</span>
              </Button>
              {storyAuthors.map((author) => <Button key={author.id} variant="ghost" className="h-auto w-16 shrink-0 flex-col gap-2 p-0" onClick={() => onStory(author)}><span className="rounded-full border-2 border-primary p-0.5"><Avatar author={author} /></span><span className="w-full truncate text-[10px]">{author.handle}</span></Button>)}
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 sm:hidden"><div className="flex h-10 flex-1 items-center gap-2 rounded-full bg-card px-4 shadow-sm"><Search className="size-4 text-muted-foreground" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar no Jaa" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div>
          {visiblePosts.map((post) => <PostCard key={post.id} post={post} liked={liked.includes(post.id)} saved={saved.includes(post.id)} onLike={() => onLike(post.id)} onSave={() => onSave(post.id)} onProfile={() => onProfile(post.author)} onOpen={() => onPost(post)} onNotice={onNotice} />)}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="flex items-center gap-3"><Avatar author={authors.luana} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">luanacosta</p><p className="truncate text-xs text-muted-foreground">Luana Costa</p></div><Button variant="ghost" size="sm" onClick={() => onProfile(authors.luana)} className="text-primary">Ver perfil</Button></div>
            <div><div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold text-muted-foreground">Sugestões para você</p><Button variant="ghost" size="sm" className="h-auto p-0 text-[11px]">Ver tudo</Button></div>{[authors.pizza, authors.marina].map((author) => <div key={author.id} className="mb-3 flex items-center gap-3"><Avatar author={author} size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{author.handle}</p><p className="truncate text-[10px] text-muted-foreground">Seguido por pessoas que você segue</p></div><Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary" onClick={() => onNotice(`Agora você segue ${author.name}`)}>Seguir</Button></div>)}</div>
            <p className="text-[10px] leading-5 text-muted-foreground">Sobre · Ajuda · Privacidade · Termos<br />© 2026 Jaa</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostCard({ post, liked, saved, onLike, onSave, onProfile, onOpen, onNotice }: { post: Post; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void; onProfile: () => void; onOpen: () => void; onNotice: (text: string) => void }) {
  return (
    <article className="overflow-hidden border-y border-border bg-card sm:rounded-lg sm:border">
      <div className="flex h-16 items-center gap-3 px-4"><Button variant="ghost" className="h-auto gap-3 p-0 text-left" onClick={onProfile}><Avatar author={post.author} size="sm" /><span><span className="flex items-center gap-1 text-xs font-bold">{post.author.handle}{post.author.verified && <span className="grid size-3.5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-2.5" /></span>}</span><span className="block text-[10px] text-muted-foreground">{post.location}</span></span></Button><Button aria-label="Mais opções" title="Mais opções" variant="ghost" size="icon" className="ml-auto"><MoreHorizontal /></Button></div>
      <Button variant="ghost" onClick={onOpen} className="block h-auto w-full rounded-none p-0"><img src={post.image} alt={post.caption} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover" /></Button>
      <div className="px-3 pb-4 pt-2">
        <div className="flex items-center"><Button aria-label={liked ? "Descurtir" : "Curtir"} title={liked ? "Descurtir" : "Curtir"} variant="ghost" size="icon" onClick={onLike} className={cn(liked && "text-social-like")}><Heart className={cn(liked && "fill-current")} /></Button><Button aria-label="Comentar" title="Comentar" variant="ghost" size="icon" onClick={onOpen}><MessageCircle /></Button><Button aria-label="Compartilhar" title="Compartilhar" variant="ghost" size="icon" onClick={() => onNotice("Link copiado para compartilhar")}><Share2 /></Button><Button aria-label={saved ? "Remover dos salvos" : "Salvar"} title={saved ? "Remover dos salvos" : "Salvar"} variant="ghost" size="icon" onClick={onSave} className="ml-auto"><Bookmark className={cn(saved && "fill-current")} /></Button></div>
        <p className="px-1 text-xs font-bold">{(post.likes + (liked ? 1 : 0)).toLocaleString("pt-BR")} curtidas</p>
        <p className="mt-2 px-1 text-xs leading-5"><Button variant="ghost" className="mr-1 inline h-auto p-0 text-xs font-bold" onClick={onProfile}>{post.author.handle}</Button>{post.caption}</p>
        <Button variant="ghost" className="mt-1 h-auto px-1 py-0 text-xs font-normal text-muted-foreground" onClick={onOpen}>Ver todos os {post.comments} comentários</Button>
        <p className="mt-2 px-1 text-[10px] uppercase text-muted-foreground">{post.time}</p>
      </div>
    </article>
  );
}

function ProfileView({ author, following, onFollow, onBack, onPost, onNotice }: { author: Author; following: boolean; onFollow: () => void; onBack: () => void; onPost: (post: Post) => void; onNotice: (text: string) => void }) {
  const authorPosts = useMemo(() => {
    const own = posts.filter((post) => post.author.id === author.id);
    return [...own, ...posts.filter((post) => post.author.id !== author.id)].slice(0, 6);
  }, [author.id]);
  return <div className="h-full overflow-y-auto bg-card"><header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-4xl items-center gap-3 px-4"><Button aria-label="Voltar" title="Voltar" variant="ghost" size="icon" onClick={onBack}><ArrowLeft /></Button><div><p className="font-display text-sm font-bold">{author.handle}</p><p className="text-[10px] text-muted-foreground">Perfil</p></div><Button aria-label="Mais opções" title="Mais opções" variant="ghost" size="icon" className="ml-auto"><MoreHorizontal /></Button></div></header>
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-9"><div className="grid grid-cols-[80px_minmax(0,1fr)] gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-10"><div className="sm:pt-1"><Avatar author={author} size="lg" /></div><div><div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-lg font-bold">{author.name}</h1>{author.verified && <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span>}</div><div className="mt-4 hidden gap-8 text-sm sm:flex"><span><b>{authorPosts.length}</b> publicações</span><span><b>{author.followers}</b> seguidores</span><span><b>{author.following}</b> seguindo</span></div><p className="mt-3 max-w-md text-xs leading-5">{author.bio}</p><div className="mt-4 flex gap-2"><Button onClick={onFollow} variant={following ? "secondary" : "default"} className="h-9 min-w-28 gap-2">{following ? <Check /> : <UserPlus />}{following ? "Seguindo" : "Seguir"}</Button><Button variant="outline" className="h-9" onClick={() => onNotice("Conversa aberta")}>Mensagem</Button></div></div></div>
      <div className="mt-6 grid grid-cols-3 border-y border-border py-3 text-center text-xs sm:hidden"><span><b className="block text-sm">{authorPosts.length}</b>publicações</span><span><b className="block text-sm">{author.followers}</b>seguidores</span><span><b className="block text-sm">{author.following}</b>seguindo</span></div>
      <div className="mt-7 border-t border-border"><div className="flex h-12 items-center justify-center text-xs font-bold uppercase"><ImagePlus className="mr-2 size-4" /> Publicações</div><div className="grid grid-cols-3 gap-0.5 sm:gap-1">{authorPosts.map((post, index) => <Button key={`${post.id}-${index}`} variant="ghost" className="group relative aspect-square h-auto overflow-hidden rounded-none p-0" onClick={() => onPost(post)}><img src={post.image} alt={`Publicação de ${author.name}`} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></Button>)}</div></div>
    </div></div>;
}

function CreatePost({ onBack, onPublish }: { onBack: () => void; onPublish: () => void }) {
  const choices = [socialPrato, socialLuana, socialPizza, socialFeira, boloChocolate, limonadaRosa];
  const [image, setImage] = useState(choices[0]);
  const [caption, setCaption] = useState("");
  return <div className="h-full overflow-y-auto"><header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-5xl items-center gap-3 px-4"><Button aria-label="Cancelar" title="Cancelar" variant="ghost" size="icon" onClick={onBack}><X /></Button><h1 className="font-display text-base font-bold">Nova publicação</h1><Button onClick={onPublish} disabled={!caption.trim()} className="ml-auto rounded-full px-5">Compartilhar</Button></div></header>
    <div className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-8 md:grid-cols-[minmax(0,1fr)_340px]"><div><div className="aspect-square overflow-hidden rounded-lg bg-muted"><img src={image} alt="Prévia da nova publicação" width={1024} height={1024} className="h-full w-full object-cover" /></div><div className="mt-3 grid grid-cols-6 gap-2">{choices.map((choice, index) => <Button key={choice} aria-label={`Escolher imagem ${index + 1}`} variant="ghost" onClick={() => setImage(choice)} className={cn("aspect-square h-auto overflow-hidden rounded-md border-2 p-0", image === choice ? "border-primary" : "border-transparent")}><img src={choice} alt="" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" /></Button>)}</div></div>
      <div className="rounded-lg border border-border bg-card p-4"><div className="flex items-center gap-3 border-b border-border pb-4"><Avatar author={authors.luana} size="sm" /><div><p className="text-xs font-bold">luanacosta</p><p className="text-[10px] text-muted-foreground">Compartilhando no seu perfil</p></div></div><textarea value={caption} onChange={(event) => setCaption(event.target.value.slice(0, 500))} placeholder="Escreva uma legenda..." className="mt-4 min-h-40 w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground" /><p className="text-right text-[10px] text-muted-foreground">{caption.length}/500</p><div className="mt-4 border-t border-border pt-2"><Button variant="ghost" className="w-full justify-between px-1" onClick={() => undefined}><span className="flex items-center gap-2"><MapPin className="size-4" />Adicionar localização</span><ChevronRight className="size-4" /></Button></div></div></div></div>;
}

function PostDetail({ post, liked, saved, onLike, onSave, onBack, onProfile, onNotice }: { post: Post; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void; onBack: () => void; onProfile: () => void; onNotice: (text: string) => void }) {
  const [comment, setComment] = useState("");
  return <div className="h-full overflow-y-auto"><header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-5xl items-center gap-3 px-4"><Button aria-label="Voltar" title="Voltar" variant="ghost" size="icon" onClick={onBack}><ArrowLeft /></Button><h1 className="font-display text-base font-bold">Publicação</h1></div></header><div className="mx-auto grid max-w-5xl bg-card md:my-8 md:grid-cols-[minmax(0,1fr)_380px] md:overflow-hidden md:rounded-lg md:border md:border-border"><img src={post.image} alt={post.caption} width={1024} height={1024} className="aspect-square h-full w-full object-cover" /><div className="flex min-h-[460px] flex-col"><div className="flex items-center gap-3 border-b border-border p-4"><Button variant="ghost" className="h-auto gap-3 p-0" onClick={onProfile}><Avatar author={post.author} size="sm" /><span className="text-xs font-bold">{post.author.handle}</span></Button></div><div className="flex-1 space-y-5 p-4"><div className="flex gap-3"><Avatar author={post.author} size="sm" /><p className="text-xs leading-5"><b className="mr-1">{post.author.handle}</b>{post.caption}</p></div><div className="flex gap-3"><Avatar author={authors.luana} size="sm" /><p className="text-xs leading-5"><b className="mr-1">luanacosta</b>Que registro lindo! Já quero conhecer. <span className="block text-[10px] text-muted-foreground">há 8 min · Responder</span></p></div></div><div className="border-t border-border p-3"><div className="flex"><Button aria-label="Curtir" variant="ghost" size="icon" onClick={onLike} className={cn(liked && "text-social-like")}><Heart className={cn(liked && "fill-current")} /></Button><Button aria-label="Compartilhar" variant="ghost" size="icon" onClick={() => onNotice("Link copiado para compartilhar")}><Share2 /></Button><Button aria-label="Salvar" variant="ghost" size="icon" onClick={onSave} className="ml-auto"><Bookmark className={cn(saved && "fill-current")} /></Button></div><p className="px-2 text-xs font-bold">{(post.likes + (liked ? 1 : 0)).toLocaleString("pt-BR")} curtidas</p><div className="mt-3 flex gap-2 border-t border-border pt-3"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Adicione um comentário..." className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none" /><Button size="sm" variant="ghost" disabled={!comment.trim()} className="text-primary" onClick={() => { setComment(""); onNotice("Comentário publicado"); }}>Publicar</Button></div></div></div></div></div>;
}