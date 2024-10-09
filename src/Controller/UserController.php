<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/user', name: 'app_user', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): Response
    {
        $users = $doctrine
            ->getRepository(User::class)
            ->findAll();

        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'lastName' => $user->getLastName(),
                'email' => $user->getEmail(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i'),
                'isLocked' => $user->isLocked()
            ];
        }
        return $this->json($data);
    }

    #[Route('/user', name: 'create_user', methods: ['POST'])]
    public function create(ManagerRegistry $doctrine, Request $request): Response
    {
        $entityManager = $doctrine->getManager();

        $user = new User();
        $user->setName($request->getPayload()->get('name'));
        $user->setLastName($request->getPayload()->get('lastName'));
        $user->setEmail($request->getPayload()->get('email'));
        $user->setCreatedAt(new \DateTimeImmutable('now'));

        $user->setLocked(false);

        $entityManager->persist($user);
        $entityManager->flush();

        $data = [
            'success' => true,
            'data' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'lastName' => $user->getLastName(),
                'email' => $user->getEmail(),
                'createdAt' => $user->getCreatedAt(),
                'isLocked' => $user->isLocked()
            ]
        ];

        return $this->json($data);
    }

    #[Route('/user/{id}', name: 'view_user', methods: ['GET'])]
    public function view(ManagerRegistry $doctrine, int $id): Response
    {
        if (!$user = $doctrine->getRepository(User::class)->find($id)) {
            return $this->json('No found user ID:' . $id, 404);
        }

        $data = [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i'),
            'isLocked' => $user->isLocked()
        ];

        return $this->json($data);
    }

    #[Route('/user/{id}', name: 'update_user', methods: ['PUT', 'PATCH'])]
    public function update(ManagerRegistry $doctrine, Request $request, int $id): Response
    {
        $entityManager = $doctrine->getManager();

        if (!$user = $entityManager->getRepository(User::class)->find($id)) {
            return $this->json('No found user ID:' . $id, 404);
        }
        // $content = json_decode($request->getContent());
        if ($name = $request->getPayload()->get('name')) {
            $user->setName($name);
        }
        if ($lastName = $request->getPayload()->get('lastName')) {
            $user->setLastName($lastName);
        }
        if ($email = $request->getPayload()->get('email')) {
            $user->setEmail($email);
        }

        $entityManager->flush();

        $data = [
            'success' => true,
            'data' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'lastName' => $user->getLastName(),
                'email' => $user->getEmail(),
                'createdAt' => $user->getCreatedAt(),
                'isLocked' => $user->isLocked()
            ]
        ];

        return $this->json($data);
    }

    #[Route('/user/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function delete(ManagerRegistry $doctrine, int $id): Response
    {
        $entityManager = $doctrine->getManager();

        if (!$user = $entityManager->getRepository(User::class)->find($id)) {
            return $this->json('No found user ID:' . $id, 404);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json('Deleted user ID:' . $id);
    }

}
